
"use client";

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUser } from '@/hooks/useUser';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { handleAppError } from '@/lib/errorHandler';
import { auth } from '@/lib/firebase/config';
import axios from 'axios';

const eventFormSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  category: z.enum(['performance', 'competition', 'masterclass', 'audition', 'showcase', 'networking', 'festival'], { required_error: "Category is required" }),
  skillLevel: z.enum(['beginner', 'intermediate', 'advanced', 'all_levels'], { required_error: "Skill level is required" }),
  locationType: z.enum(['online', 'in_person', 'hybrid'], { required_error: "Location type is required" }),
  venue: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  country: z.string().min(2, 'Country is required'),
  price: z.preprocess((a) => parseInt(z.string().parse(a), 10), z.number().nonnegative()),
  startDate: z.date({ required_error: 'Start date is required'}),
  maxParticipants: z.preprocess((a) => parseInt(z.string().parse(a), 10), z.number().positive("Must be greater than 0")),
});

type EventFormValues = z.infer<typeof eventFormSchema>;

export function EventForm() {
  const { user } = useUser();
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: 'Beginner Contemporary Workshop',
      description: 'Join us for a 2-hour workshop covering the fundamentals of contemporary dance. No prior experience needed!',
      city: 'New York',
      country: 'USA',
      price: 25,
      maxParticipants: 20,
    },
  });

  const onSubmit = async (values: EventFormValues) => {
    console.log("EventForm.tsx: processForm called.");
     if (!auth.currentUser || user?.role !== 'organizer') {
        toast({ variant: 'destructive', title: 'Unauthorized', description: 'You must be an organizer to post an event.' });
        return;
    }
    
    try {
        console.log("EventForm.tsx: Getting user ID token...");
        const token = await auth.currentUser.getIdToken();
        console.log("EventForm.tsx: Token retrieved. Sending request to /api/events.");

        await axios.post('/api/events', values, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        console.log("EventForm.tsx: Event submission successful.");
        toast({ title: 'Success!', description: 'Your event has been posted.' });
        router.push('/events');
    } catch (error: any) {
        console.error("EventForm.tsx: Error during event submission:", error);
        const errorMessage = handleAppError(error.response?.data?.message || error.message, 'Event Creation');
        toast({ variant: 'destructive', title: 'Error', description: errorMessage });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField control={form.control} name="title" render={({ field }) => (<FormItem><FormLabel>Event Title</FormLabel><FormControl><Input placeholder="e.g., Urban Dance Masterclass" {...field} /></FormControl><FormMessage /></FormItem>)} />
        <FormField control={form.control} name="description" render={({ field }) => (<FormItem><FormLabel>Description</FormLabel><FormControl><Textarea placeholder="Describe the event, what attendees will learn, and any prerequisites." {...field} /></FormControl><FormMessage /></FormItem>)} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FormField control={form.control} name="category" render={({ field }) => (<FormItem><FormLabel>Event Category</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger></FormControl><SelectContent><SelectItem value="performance">Performance</SelectItem><SelectItem value="competition">Competition</SelectItem><SelectItem value="masterclass">Masterclass</SelectItem><SelectItem value="audition">Audition</SelectItem><SelectItem value="showcase">Showcase</SelectItem><SelectItem value="networking">Networking</SelectItem><SelectItem value="festival">Festival</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
          <FormField control={form.control} name="skillLevel" render={({ field }) => (<FormItem><FormLabel>Skill Level</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a skill level" /></SelectTrigger></FormControl><SelectContent><SelectItem value="all_levels">All Levels</SelectItem><SelectItem value="beginner">Beginner</SelectItem><SelectItem value="intermediate">Intermediate</SelectItem><SelectItem value="advanced">Advanced</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FormField control={form.control} name="locationType" render={({ field }) => (<FormItem><FormLabel>Location Type</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select location type" /></SelectTrigger></FormControl><SelectContent><SelectItem value="in_person">In-Person</SelectItem><SelectItem value="online">Online</SelectItem><SelectItem value="hybrid">Hybrid</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="price" render={({ field }) => (<FormItem><FormLabel>Price ($)</FormLabel><FormControl><Input type="number" placeholder="Enter 0 for a free event" {...field} /></FormControl><FormMessage /></FormItem>)} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FormField control={form.control} name="venue" render={({ field }) => (<FormItem className="md:col-span-1"><FormLabel>Venue / Platform</FormLabel><FormControl><Input placeholder="e.g., Broadway Dance Center or Zoom" {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="city" render={({ field }) => (<FormItem><FormLabel>City</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="country" render={({ field }) => (<FormItem><FormLabel>Country</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
        </div>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <FormField control={form.control} name="startDate" render={({ field }) => (<FormItem><FormLabel>Start Date</FormLabel><FormControl><Input type="date" {...field} onChange={e => field.onChange(e.target.valueAsDate)} value={field.value?.toISOString().split('T')[0]} /></FormControl><FormMessage /></FormItem>)} />
             <FormField control={form.control} name="maxParticipants" render={({ field }) => (<FormItem><FormLabel>Max Participants</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
        </div>
        <Button type="submit" size="lg" className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white font-bold" disabled={form.formState.isSubmitting}>
             {form.formState.isSubmitting ? 'Posting Event...' : 'Post Event'}
        </Button>
      </form>
    </Form>
  );
}
