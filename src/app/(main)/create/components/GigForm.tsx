
"use client";

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, UseFormReturn } from 'react-hook-form';
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
import { Check, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Gig } from '@/lib/types';

const gigSchema = z.object({
  // Step 1
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  type: z.enum(['performance', 'photoshoot', 'recording', 'event', 'audition', 'modeling', 'teaching', 'collaboration'], { required_error: 'Gig type is required.' }),
  category: z.string().min(2, 'Category is required'),
  // Step 2 is auto-filled
  // Step 3
  artistType: z.array(z.string()).min(1, 'At least one artist type is required').optional(),
  experienceLevel: z.enum(['beginner', 'intermediate', 'advanced', 'professional'], { required_error: 'Experience level is required.' }),
  // Step 4
  location: z.object({
    city: z.string().min(2, 'City is required'),
    country: z.string().min(2, 'Country is required'),
    isRemote: z.boolean(),
  }),
  // Step 5
  compensation: z.object({
    type: z.enum(['hourly', 'daily', 'project', 'revenue_share'], { required_error: 'Compensation type is required.' }),
    amount: z.preprocess((a) => {
        const str = z.string().parse(a);
        if (str === '') return undefined;
        return parseInt(str, 10);
    }, z.number().positive().optional()),
    negotiable: z.boolean(),
  }),
  // Step 8
  status: z.enum(['draft', 'active']),
});


type GigFormValues = z.infer<typeof gigSchema>;

const steps = [
  { id: 'Step 1', name: 'Basic Details', fields: ['title', 'description', 'type', 'category'] },
  { id: 'Step 2', name: 'Artist Requirements', fields: ['artistType', 'experienceLevel'] },
  { id: 'Step 3', name: 'Location & Schedule' },
  { id: 'Step 4', name: 'Compensation', fields: ['compensation.type', 'compensation.amount', 'compensation.negotiable'] },
  { id: 'Step 5', name: 'Review & Publish' },
];

export function GigForm() {
  const { user } = useUser();
  const { toast } = useToast();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<GigFormValues>({
    resolver: zodResolver(gigSchema),
    defaultValues: {
      title: '',
      description: '',
      category: '',
      artistType: [],
      location: { city: '', country: '', isRemote: false },
      compensation: { negotiable: false },
      status: 'active',
    },
  });

  const processForm = async (values: GigFormValues) => {
    if (!user || user.role !== 'organizer') {
      toast({ variant: 'destructive', title: 'Unauthorized', description: 'You must be an organizer to post a gig.' });
      return;
    }
    setIsSubmitting(true);
    try {
      await addGig(user.id, values as Partial<Gig>);
      toast({ title: 'Success!', description: 'Your gig has been posted.' });
      router.push('/gigs');
    } catch (error) {
      const errorMessage = handleAppError(error, 'Gig Creation');
      toast({ variant: 'destructive', title: 'Error', description: errorMessage });
    } finally {
        setIsSubmitting(false);
    }
  };

  type FieldName = keyof GigFormValues | `location.${"city" | "country"}` | `compensation.${"type" | "amount"}`;


  const next = async () => {
    const fields = steps[currentStep].fields;
    const output = await form.trigger(fields as FieldName[], { shouldFocus: true });

    if (!output) return;

    if (currentStep < steps.length - 1) {
        setCurrentStep(step => step + 1);
    }
  };

  const prev = () => {
    if (currentStep > 0) {
      setCurrentStep(step => step - 1);
    }
  };

  return (
    <div>
        {/* Stepper */}
        <nav aria-label="Progress">
            <ol role="list" className="space-y-4 md:flex md:space-x-8 md:space-y-0 mb-8">
                {steps.map((step, index) => (
                <li key={step.name} className="md:flex-1">
                    {currentStep > index ? (
                    <div className="group flex w-full flex-col border-l-4 border-primary py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4">
                        <span className="text-sm font-medium text-primary transition-colors ">{step.id}</span>
                        <span className="text-sm font-medium">{step.name}</span>
                    </div>
                    ) : currentStep === index ? (
                    <div
                        className="flex w-full flex-col border-l-4 border-primary py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4"
                        aria-current="step"
                    >
                        <span className="text-sm font-medium text-primary">{step.id}</span>
                        <span className="text-sm font-medium">{step.name}</span>
                    </div>
                    ) : (
                    <div className="group flex w-full flex-col border-l-4 border-gray-200 py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4">
                        <span className="text-sm font-medium text-gray-500 transition-colors">{step.id}</span>
                        <span className="text-sm font-medium">{step.name}</span>
                    </div>
                    )}
                </li>
                ))}
            </ol>
        </nav>

        <Form {...form}>
            <form onSubmit={form.handleSubmit(processForm)} className="space-y-8">
                {/* Step 1: Basic Details */}
                <div className={cn("block", { "hidden": currentStep !== 0 })}>
                    <h2 className="text-lg font-medium mb-4">Basic Gig Details</h2>
                    <div className="space-y-4">
                        <FormField control={form.control} name="title" render={({ field }) => (<FormItem><FormLabel>Gig Title</FormLabel><FormControl><Input placeholder="e.g., Lead Dancer for Music Video" {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="description" render={({ field }) => (<FormItem><FormLabel>Description</FormLabel><FormControl><Textarea placeholder="Describe the gig, responsibilities, and what you're looking for." {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <FormField control={form.control} name="type" render={({ field }) => (<FormItem><FormLabel>Gig Type</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a type" /></SelectTrigger></FormControl><SelectContent><SelectItem value="performance">Performance</SelectItem><SelectItem value="photoshoot">Photoshoot</SelectItem><SelectItem value="recording">Recording</SelectItem><SelectItem value="event">Event Staff</SelectItem><SelectItem value="audition">Audition</SelectItem><SelectItem value="modeling">Modeling</SelectItem><SelectItem value="teaching">Teaching</SelectItem><SelectItem value="collaboration">Collaboration</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                            <FormField control={form.control} name="category" render={({ field }) => (<FormItem><FormLabel>Category</FormLabel><FormControl><Input placeholder="e.g., Hip-Hop, Commercial" {...field} /></FormControl><FormMessage /></FormItem>)} />
                        </div>
                    </div>
                </div>

                {/* Step 2: Artist Requirements */}
                <div className={cn("block", { "hidden": currentStep !== 1 })}>
                    <h2 className="text-lg font-medium mb-4">Artist Requirements</h2>
                    {/* Simplified for brevity, add more fields as needed based on schema */}
                    <FormField control={form.control} name="experienceLevel" render={({ field }) => (<FormItem><FormLabel>Experience Level</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select required experience level" /></SelectTrigger></FormControl><SelectContent><SelectItem value="beginner">Beginner</SelectItem><SelectItem value="intermediate">Intermediate</SelectItem><SelectItem value="advanced">Advanced</SelectItem><SelectItem value="professional">Professional</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                </div>
                
                {/* Step 3: Location */}
                <div className={cn("block", { "hidden": currentStep !== 2 })}>
                    <h2 className="text-lg font-medium mb-4">Location & Schedule</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <FormField control={form.control} name="location.city" render={({ field }) => (<FormItem><FormLabel>City</FormLabel><FormControl><Input placeholder="e.g., New York" {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="location.country" render={({ field }) => (<FormItem><FormLabel>Country</FormLabel><FormControl><Input placeholder="e.g., USA" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    </div>
                </div>

                {/* Step 4: Compensation */}
                 <div className={cn("block", { "hidden": currentStep !== 3 })}>
                    <h2 className="text-lg font-medium mb-4">Compensation</h2>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <FormField control={form.control} name="compensation.type" render={({ field }) => (<FormItem><FormLabel>Compensation Type</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select payment model" /></SelectTrigger></FormControl><SelectContent><SelectItem value="hourly">Hourly</SelectItem><SelectItem value="daily">Daily</SelectItem><SelectItem value="project">Project-based</SelectItem><SelectItem value="revenue_share">Revenue Share</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="compensation.amount" render={({ field }) => (<FormItem><FormLabel>Compensation Amount ($)</FormLabel><FormControl><Input type="number" placeholder="e.g., 500" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    </div>
                 </div>

                 {/* Step 5: Review & Publish */}
                 <div className={cn("block", { "hidden": currentStep !== 4 })}>
                    <h2 className="text-2xl font-bold mb-4">Review Your Gig</h2>
                    <p className="text-muted-foreground mb-6">You're ready to post! Review the details below. You can save it as a draft to edit later, or publish it now to start receiving applications.</p>
                    {/* Add a summary of the gig details here */}
                 </div>
            </form>
        </Form>
        
        {/* Navigation */}
        <div className="mt-8 pt-5">
            <div className="flex justify-between">
            <Button type="button" onClick={prev} disabled={currentStep === 0 || isSubmitting} variant="outline">
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back
            </Button>
            
            {currentStep === steps.length - 1 ? (
                <div className="flex gap-4">
                    <Button type="button" onClick={() => { form.setValue('status', 'draft'); form.handleSubmit(processForm)(); }} disabled={isSubmitting} variant="secondary">
                        {isSubmitting && form.getValues().status === 'draft' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Save as Draft
                    </Button>
                    <Button type="button" onClick={() => { form.setValue('status', 'active'); form.handleSubmit(processForm)(); }} disabled={isSubmitting} className="bg-gradient-to-r from-purple-500 to-orange-500 text-white font-bold">
                        {isSubmitting && form.getValues().status === 'active' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Publish Gig
                    </Button>
                </div>
            ) : (
                <Button type="button" onClick={next} disabled={isSubmitting}>
                    {currentStep === steps.length - 2 ? 'Review & Finish' : 'Next Step'}
                    <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
            )}
            </div>
        </div>
    </div>
  );
}

    