
"use client";

import { useState, useRef } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, FormProvider } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
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
import { ImageUpload } from '@/components/shared/ImageUpload';
import { cn } from '@/lib/utils';

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
  thumbnailUrl: z.string().optional(),
  status: z.enum(['draft', 'active']),
});

type EventFormValues = z.infer<typeof eventFormSchema>;
type EventStatus = 'draft' | 'active';

const steps = [
  { id: 1, name: 'Details', fields: ['title', 'description', 'category'] },
  { id: 2, name: 'Logistics', fields: ['locationType', 'city', 'country', 'startDate'] },
  { id: 3, name: 'Requirements', fields: ['skillLevel', 'price', 'maxParticipants'] },
  { id: 4, name: 'Image' },
  { id: 5, name: 'Review & Publish' },
];

export function EventForm() {
  const { user } = useUser();
  const { toast } = useToast();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const statusRef = useRef<EventStatus>('active');

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    mode: 'onChange',
    defaultValues: {
      title: 'Advanced Hip-Hop Masterclass with Pro Dancers',
      description: 'This is a test event description. Join us for an intensive workshop focusing on advanced choreography, musicality, and performance skills in hip-hop dance. This session is designed for experienced dancers looking to push their boundaries.',
      category: 'masterclass',
      skillLevel: 'advanced',
      locationType: 'in_person',
      venue: 'Starlight Dance Studio',
      city: 'Los Angeles',
      country: 'USA',
      price: 75,
      startDate: new Date(new Date().setDate(new Date().getDate() + 30)),
      maxParticipants: 25,
      status: 'active',
    },
  });

  const processSubmit = async (values: EventFormValues) => {
    const status = statusRef.current;
    console.log(`EventForm.tsx: processSubmit called with status: ${status}`);
    setIsSubmitting(true);
    
    if (!auth.currentUser || user?.role !== 'organizer') {
        console.error("EventForm.tsx: Unauthorized attempt to create event.");
        toast({ variant: 'destructive', title: 'Unauthorized', description: 'You must be an organizer to post an event.' });
        setIsSubmitting(false);
        return;
    }
    
    const finalValues = { ...values, status };
    
    try {
        console.log("EventForm.tsx: Getting user ID token...");
        const token = await auth.currentUser.getIdToken();
        console.log("EventForm.tsx: Token retrieved. Sending POST request to /api/events with data:", finalValues);
        await axios.post('/api/events', finalValues, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        console.log("EventForm.tsx: API request successful.");
        toast({ title: 'Success!', description: `Your event has been ${status === 'draft' ? 'saved as a draft' : 'published'}.` });
        router.push('/events');
    } catch (error: any) {
        console.error("EventForm.tsx: An error occurred during submission.");
        let errorMessage: string;
        if (axios.isAxiosError(error)) {
          console.error("EventForm.tsx: Axios error. Server responded with:", error.response?.status, error.response?.data);
          errorMessage = handleAppError(error.response?.data?.message || error.message, 'Event Creation');
        } else {
          console.error("EventForm.tsx: Non-Axios error:", error);
          errorMessage = handleAppError(error.message, 'Event Creation');
        }
        toast({ variant: 'destructive', title: 'Error', description: errorMessage });
    } finally {
        console.log("EventForm.tsx: Submission process finished. Setting isSubmitting to false.");
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
      setCurrentStep(step => step + 1);
    }
  };

  const triggerSubmit = (status: EventStatus) => {
    statusRef.current = status;
    form.handleSubmit(processSubmit)();
  };

  return (
    <div>
        <div className="mb-12">
            <ol role="list" className="relative flex justify-between items-center w-full">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-gray-200" aria-hidden="true"></div>
                <div 
                    className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-primary transition-all duration-500" 
                    style={{ width: `calc(${(currentStep / (steps.length - 1)) * 100}%)` }}
                ></div>
                {steps.map((step, stepIdx) => (
                    <li key={step.name} className="relative flex flex-col items-center text-center">
                        <div className={cn(
                            "flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all duration-300 bg-background",
                            stepIdx <= currentStep ? 'border-primary' : 'border-gray-300'
                        )}>
                            <div className={cn(
                                "h-4 w-4 rounded-full transition-all duration-300",
                                stepIdx <= currentStep ? 'bg-primary' : 'bg-gray-300'
                            )}></div>
                        </div>
                        <p className={cn("text-xs font-semibold mt-2 whitespace-nowrap", { 
                            'text-primary font-bold': stepIdx === currentStep,
                            'text-foreground': stepIdx < currentStep,
                            'text-muted-foreground': stepIdx > currentStep
                        })}>{step.name}</p>
                    </li>
                ))}
            </ol>
        </div>

        <FormProvider {...form}>
          <form onSubmit={(e) => e.preventDefault()} noValidate>
            {currentStep === 0 && <Step1_EventDetails form={form} />}
            {currentStep === 1 && <Step2_EventLogistics form={form} />}
            {currentStep === 2 && <Step3_EventRequirements form={form} />}
            {currentStep === 3 && (
                <ImageUpload 
                    onUpload={(url) => form.setValue('thumbnailUrl', url)}
                    storagePath="event-thumbnails"
                    label="Upload Event Thumbnail"
                />
            )}
            {currentStep === 4 && <Step4_ReviewEvent />}

            <div className="mt-8 pt-5">
                <div className="flex justify-between">
                <Button type="button" onClick={prev} disabled={currentStep === 0 || isSubmitting} variant="outline">
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Back
                </Button>
                
                {currentStep === steps.length - 1 ? (
                    <div className="flex gap-4">
                        <Button 
                            type="button" 
                            onClick={() => triggerSubmit('draft')}
                            disabled={isSubmitting} 
                            variant="secondary"
                        >
                            {isSubmitting && statusRef.current === 'draft' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Save as Draft
                        </Button>
                        <Button 
                            type="button" 
                            onClick={() => triggerSubmit('active')}
                            disabled={isSubmitting} 
                            className="bg-gradient-to-r from-purple-500 to-orange-500 text-white font-bold"
                        >
                            {isSubmitting && statusRef.current === 'active' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
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
