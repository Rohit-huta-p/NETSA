
"use client";

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { addGig } from '@/lib/firebase/firestore';
import { useUser } from '@/hooks/useUser';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { handleAppError } from '@/lib/errorHandler';

const gigFormSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  type: z.enum(['performance', 'photoshoot', 'recording', 'event', 'audition', 'modeling', 'teaching', 'collaboration']),
  category: z.string().min(2, 'Category is required'),
  city: z.string().min(2, 'City is required'),
  country: z.string().min(2, 'Country is required'),
  compensationType: z.enum(['hourly', 'daily', 'project', 'revenue_share']),
  compensationAmount: z.preprocess((a) => parseInt(z.string().parse(a), 10), z.number().positive().optional()),
});

export function GigForm() {
    const { user } = useUser();
    const { toast } = useToast();
    const router = useRouter();

  const form = useForm<z.infer<typeof gigFormSchema>>({
    resolver: zodResolver(gigFormSchema),
    defaultValues: {
      title: '',
      description: '',
      category: '',
      city: '',
      country: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof gigFormSchema>) => {
    if (!user || user.role !== 'organizer') {
        toast({ variant: 'destructive', title: 'Unauthorized', description: 'You must be an organizer to post a gig.' });
        return;
    }
    
    try {
        await addGig(user.id, values);
        toast({ title: 'Success!', description: 'Your gig has been posted.' });
        router.push('/gigs');
    } catch (error) {
        const errorMessage = handleAppError(error, 'Gig Creation');
        toast({ variant: 'destructive', title: 'Error', description: errorMessage });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField control={form.control} name="title" render={({ field }) => (<FormItem><FormLabel>Gig Title</FormLabel><FormControl><Input placeholder="e.g., Lead Dancer for Music Video" {...field} /></FormControl><FormMessage /></FormItem>)} />
        <FormField control={form.control} name="description" render={({ field }) => (<FormItem><FormLabel>Description</FormLabel><FormControl><Textarea placeholder="Describe the gig, responsibilities, and what you're looking for." {...field} /></FormControl><FormMessage /></FormItem>)} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FormField control={form.control} name="type" render={({ field }) => (<FormItem><FormLabel>Gig Type</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a type" /></SelectTrigger></FormControl><SelectContent><SelectItem value="performance">Performance</SelectItem><SelectItem value="photoshoot">Photoshoot</SelectItem><SelectItem value="recording">Recording</SelectItem><SelectItem value="event">Event Staff</SelectItem><SelectItem value="audition">Audition</SelectItem><SelectItem value="modeling">Modeling</SelectItem><SelectItem value="teaching">Teaching</SelectItem><SelectItem value="collaboration">Collaboration</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="category" render={({ field }) => (<FormItem><FormLabel>Category</FormLabel><FormControl><Input placeholder="e.g., Hip-Hop, Commercial" {...field} /></FormControl><FormMessage /></FormItem>)} />
        </div>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FormField control={form.control} name="city" render={({ field }) => (<FormItem><FormLabel>City</FormLabel><FormControl><Input placeholder="e.g., New York" {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="country" render={({ field }) => (<FormItem><FormLabel>Country</FormLabel><FormControl><Input placeholder="e.g., USA" {...field} /></FormControl><FormMessage /></FormItem>)} />
        </div>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FormField control={form.control} name="compensationType" render={({ field }) => (<FormItem><FormLabel>Compensation Type</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select payment model" /></SelectTrigger></FormControl><SelectContent><SelectItem value="hourly">Hourly</SelectItem><SelectItem value="daily">Daily</SelectItem><SelectItem value="project">Project-based</SelectItem><SelectItem value="revenue_share">Revenue Share</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="compensationAmount" render={({ field }) => (<FormItem><FormLabel>Compensation Amount ($)</FormLabel><FormControl><Input type="number" placeholder="e.g., 500" {...field} /></FormControl><FormMessage /></FormItem>)} />
        </div>
        <Button type="submit" size="lg" className="w-full bg-gradient-to-r from-purple-500 to-orange-500 text-white font-bold" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? 'Posting Gig...' : 'Post Gig'}
        </Button>
      </form>
    </Form>
  );
}
