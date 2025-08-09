
"use client";

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { addEvent } from '@/lib/firebase/firestore';
import { useUser } from '@/hooks/useUser';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

const eventFormSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  category: z.enum(['performance', 'competition', 'masterclass', 'audition', 'showcase', 'networking', 'festival']),
  skillLevel: z.enum(['beginner', 'intermediate', 'advanced', 'all_levels']),
  locationType: z.enum(['online', 'in_person', 'hybrid']),
  venue: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  country: z.string().min(2, 'Country is required'),
  price: z.preprocess((a) => parseInt(z.string().parse(a), 10), z.number().nonnegative()),
});

export function EventForm() {
  const { user } = useUser();
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof eventFormSchema>>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: '',
      description: '',
      city: '',
      country: '',
      price: 0
    },
  });

  const onSubmit = async (values: z.infer<typeof eventFormSchema>) => {
     if (!user || user.role !== 'organizer') {
        toast({ variant: 'destructive', title: 'Unauthorized', description: 'You must be an organizer to post an event.' });
        return;
    }
    
    try {
        await addEvent(user.id, values);
        toast({ title: 'Success!', description: 'Your event has been posted.' });
        router.push('/events');
    } catch (error) {
        console.error("Failed to post event: ", error);
        toast({ variant: 'destructive', title: 'Error', description: 'Failed to post event. Please try again.' });
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
        <Button type="submit" size="lg" className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white font-bold" disabled={form.formState.isSubmitting}>
             {form.formState.isSubmitting ? 'Posting Event...' : 'Post Event'}
        </Button>
      </form>
    </Form>
  );
}
