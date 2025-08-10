
"use client";

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, FormProvider } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useUser } from '@/hooks/useUser';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { handleAppError } from '@/lib/errorHandler';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { auth } from '@/lib/firebase/config';
import axios from 'axios';
import Step1_EventDetails from './steps/event/Step1_EventDetails';
import Step2_EventLogistics from './steps/event/Step2_EventLogistics';
import Step3_EventRequirements from './steps/event/Step3_EventRequirements';
import Step4_ReviewEvent from './steps/event/Step4_ReviewEvent';

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
  status: z.enum(['draft', 'active']),
});

type EventFormValues = z.infer<typeof eventFormSchema>;

const steps = [
  { id: 'Step 1', name: 'Details', fields: ['title', 'description', 'category'] },
  { id: 'Step 2', name: 'Logistics', fields: ['locationType', 'city', 'country', 'startDate'] },
  { id: 'Step 3', name: 'Requirements', fields: ['skillLevel', 'price', 'maxParticipants'] },
  { id: 'Step 4', name: 'Review & Publish' },
];

export function EventForm() {
  const { user } = useUser();
  const { toast } = useToast();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    mode: 'onChange',
    defaultValues: {
      title: 'Beginner Contemporary Workshop',
      description: 'Join us for a 2-hour workshop covering the fundamentals of contemporary dance. No prior experience needed!',
      city: 'New York',
      country: 'USA',
      price: 25,
      maxParticipants: 20,
      status: 'active'
    },
  });

  const onSubmit = async (values: EventFormValues) => {
    setIsSubmitting(true);
    if (!auth.currentUser || user?.role !== 'organizer') {
        toast({ variant: 'destructive', title: 'Unauthorized', description: 'You must be an organizer to post an event.' });
        setIsSubmitting(false);
        return;
    }
    
    try {
        const token = await auth.currentUser.getIdToken();
        await axios.post('/api/events', values, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        toast({ title: 'Success!', description: `Your event has been ${values.status === 'draft' ? 'saved as a draft' : 'published'}.` });
        router.push('/events');
    } catch (error: any) {
        let errorMessage: string;
        if (axios.isAxiosError(error)) {
          console.error("EventForm.tsx: Server responded with error:", error.response?.data);
          errorMessage = handleAppError(error.response?.data?.message || error.message, 'Event Creation');
        } else {
          errorMessage = handleAppError(error.message, 'Event Creation');
        }
        toast({ variant: 'destructive', title: 'Error', description: errorMessage });
    } finally {
        setIsSubmitting(false);
    }
  };

  type FieldName = keyof EventFormValues;

  const next = async () => {
    const fields = steps[currentStep].fields;
    if (fields) {
        const output = await form.trigger(fields as FieldName[], { shouldFocus: true });
        if (!output) return;
    }

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
        <nav aria-label="Progress" className="mb-8">
            <ol role="list" className="space-y-4 md:flex md:space-x-8 md:space-y-0">
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

        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            {currentStep === 0 && <Step1_EventDetails form={form} />}
            {currentStep === 1 && <Step2_EventLogistics form={form} />}
            {currentStep === 2 && <Step3_EventRequirements form={form} />}
            {currentStep === 3 && <Step4_ReviewEvent />}

            <div className="mt-8 pt-5">
                <div className="flex justify-between">
                <Button type="button" onClick={prev} disabled={currentStep === 0 || isSubmitting} variant="outline">
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Back
                </Button>
                
                {currentStep === steps.length - 1 ? (
                    <div className="flex gap-4">
                        <Button 
                            type="submit" 
                            onClick={() => form.setValue('status', 'draft')} 
                            disabled={isSubmitting} 
                            variant="secondary"
                        >
                            {isSubmitting && form.getValues().status === 'draft' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Save as Draft
                        </Button>
                        <Button 
                            type="submit" 
                            onClick={() => form.setValue('status', 'active')} 
                            disabled={isSubmitting} 
                            className="bg-gradient-to-r from-purple-500 to-orange-500 text-white font-bold"
                        >
                            {isSubmitting && form.getValues().status === 'active' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Publish Event
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
          </form>
        </FormProvider>
    </div>
  );
}
