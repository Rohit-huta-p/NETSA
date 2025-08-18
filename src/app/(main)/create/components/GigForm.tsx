
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
import Step1_BasicDetails from './steps/Step1_BasicDetails';
import Step2_ArtistRequirements from './steps/Step2_ArtistRequirements';
import Step3_LocationSchedule from './steps/Step3_LocationSchedule';
import Step4_Compensation from './steps/Step4_Compensation';
import Step6_ApplicationSettings from './steps/Step6_ApplicationSettings';
import Step7_MediaRequirements from './steps/Step7_MediaRequirements';
import Step8_ReviewPublish from './steps/Step8_ReviewPublish';
import { auth } from '@/lib/firebase/config';
import axios from 'axios';
import { ImageUpload } from '@/components/shared/ImageUpload';
import { cn } from '@/lib/utils';

const emptyStringToUndefined = z.literal('').transform(() => undefined);

function asOptionalField<T extends z.ZodTypeAny>(schema: T) {
  return schema.optional().or(emptyStringToUndefined);
}

const gigFormSchema = z.object({
  // Step 1
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  type: z.enum(['performance', 'photoshoot', 'recording', 'event', 'audition', 'modeling', 'teaching', 'collaboration'], { required_error: 'Gig type is required.' }),
  category: z.string().min(2, 'Category is required'),
  tags: z.array(z.string()).optional(),
  imageUrl: z.string().optional(),

  // Step 2
  artistType: z.array(z.string()).min(1, 'At least one artist type is required'),
  requiredSkills: z.array(z.string()).optional(),
  requiredStyles: z.array(z.string()).optional(),
  experienceLevel: z.enum(['beginner', 'intermediate', 'advanced', 'professional'], { required_error: 'Experience level is required.' }),
  ageRange: z.object({
      min: asOptionalField(z.coerce.number().positive()),
      max: asOptionalField(z.coerce.number().positive()),
  }).optional(),
  genderPreference: z.enum(['male', 'female', 'any', 'non-binary']).optional(),
  physicalRequirements: z.string().optional(),

  // Step 3
  location: z.object({
    city: z.string().min(2, 'City is required'),
    country: z.string().min(2, 'Country is required'),
    venue: z.string().optional(),
    address: z.string().optional(),
    isRemote: z.boolean().default(false),
  }),
  startDate: z.date({ required_error: 'Start date is required'}),
  endDate: z.date().optional(),
  duration: z.string().optional(),
  timeCommitment: z.string().optional(),
  
  // Step 4
  compensation: z.object({
    type: z.enum(['hourly', 'daily', 'project', 'revenue_share'], { required_error: 'Compensation type is required.' }),
    amount: asOptionalField(z.coerce.number().positive()),
    currency: z.string().optional(),
    negotiable: z.boolean().default(false),
    additionalBenefits: z.array(z.string()).optional(),
  }),
  
  // Step 6
  maxApplications: asOptionalField(z.coerce.number().positive()),
  applicationDeadline: z.date().optional(),

  // Step 7
  mediaRequirements: z.object({
    needsHeadshots: z.boolean().default(false),
    needsFullBody: z.boolean().default(false),
    needsVideoReel: z.boolean().default(false),
    needsAudioSample: z.boolean().default(false),
    specificRequirements: z.string().optional(),
  }).optional(),

  // Step 8
  isUrgent: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
  expiresAt: z.date().optional(),
  status: z.enum(['draft', 'active']),
});


type GigFormValues = z.infer<typeof gigFormSchema>;

const steps = [
  { id: 1, name: 'Basic Details', fields: ['title', 'description', 'type', 'category'] },
  { id: 2, name: 'Artist Needs', fields: ['experienceLevel', 'artistType'] },
  { id: 3, name: 'Location & Schedule', fields: ['location.city', 'location.country', 'startDate'] },
  { id: 4, name: 'Compensation', fields: ['compensation.type'] },
  { id: 5, name: 'Applications' },
  { id: 6, name: 'Media Needs' },
  { id: 7, name: 'Image' },
  { id: 8, name: 'Review & Publish' },
];

export function GigForm() {
  const { user } = useUser();
  const { toast } = useToast();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<GigFormValues>({
    resolver: zodResolver(gigFormSchema),
    mode: 'onChange',
    defaultValues: {
      title: 'Lead Dancer for Major Music Video',
      description: 'Seeking a highly skilled and charismatic lead dancer for a music video for a major recording artist. Must have experience with commercial hip-hop and be able to learn choreography quickly.',
      type: 'performance',
      category: 'Music Video',
      tags: ['hip-hop', 'commercial', 'lead role'],
      artistType: ['Dancer', 'Actor'],
      requiredSkills: ['Popping', 'Locking', 'Improvisation'],
      requiredStyles: ['Commercial Hip-Hop', 'Contemporary'],
      experienceLevel: 'professional',
      ageRange: { min: 18, max: 30 },
      genderPreference: 'any',
      physicalRequirements: 'Athletic build, height 5\'8" - 6\'2"',
      location: {
        city: 'Los Angeles',
        country: 'USA',
        venue: 'Starlight Studios',
        address: '123 Fake Street, Hollywood',
        isRemote: false,
      },
      startDate: new Date(new Date().setDate(new Date().getDate() + 14)), // Two weeks from now
      endDate: new Date(new Date().setDate(new Date().getDate() + 21)), // Three weeks from now
      duration: '5 shoot days',
      timeCommitment: 'Full-time during shoot week',
      compensation: {
        type: 'project',
        amount: 5000,
        currency: 'USD',
        negotiable: true,
        additionalBenefits: ['Catering provided', 'Travel stipend'],
      },
      maxApplications: 100,
      applicationDeadline: new Date(new Date().setDate(new Date().getDate() + 7)), // One week from now
      mediaRequirements: {
        needsHeadshots: true,
        needsFullBody: false,
        needsVideoReel: true,
        needsAudioSample: false,
        specificRequirements: 'Please submit a 1-2 minute dance reel showcasing your commercial work.',
      },
      isUrgent: true,
      isFeatured: false,
      expiresAt: undefined,
      status: 'active',
    },
  });

  const processForm = async (values: GigFormValues) => {
    console.log("GigForm.tsx: processForm called with status:", values.status);
    setIsSubmitting(true);

    if (!auth.currentUser) {
        toast({ variant: 'destructive', title: 'Unauthorized', description: 'You must be logged in to post a gig.' });
        setIsSubmitting(false);
        console.error("GigForm.tsx: Aborting submission - No current user in auth.");
        return;
    }
    
    try {
        console.log("GigForm.tsx: Getting user ID token...");
        const token = await auth.currentUser.getIdToken();
        console.log("GigForm.tsx: Token retrieved. Sending request to /api/gigs.");
        
        await axios.post('/api/gigs', values, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        console.log("GigForm.tsx: Gig submission successful.");
        toast({ title: 'Success!', description: `Your gig has been ${values.status === 'draft' ? 'saved as a draft' : 'published'}.` });
        router.push('/gigs');

    } catch (error: any) {
        console.error("GigForm.tsx: Full error object during gig submission:", error);
        
        let errorMessage: string;
        if (axios.isAxiosError(error)) {
          console.error("GigForm.tsx: Server responded with error data:", error.response?.data);
          errorMessage = handleAppError(error.response?.data?.message || error.message, 'Gig Creation');
        } else {
          errorMessage = handleAppError(error.message, 'Gig Creation');
        }

        toast({ variant: 'destructive', title: 'Error', description: errorMessage });
    } finally {
        setIsSubmitting(false);
        console.log("GigForm.tsx: processForm finished.");
    }
  };

  type FieldName = keyof GigFormValues | 'location.city' | 'location.country' | 'compensation.type' | 'startDate' | 'artistType' ;

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
        <div className="mb-12">
            <div className="relative">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-gray-200" aria-hidden="true">
                    <div 
                        className="absolute left-0 top-0 h-full bg-primary transition-all duration-500" 
                        style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                    />
                </div>
                <ol role="list" className="relative flex justify-between items-center w-full">
                    {steps.map((step, stepIdx) => (
                        <li key={step.name} className="flex flex-col items-center text-center">
                            <div className={cn(
                                "flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all duration-300",
                                stepIdx <= currentStep ? 'bg-primary border-primary' : 'bg-background border-gray-300'
                            )}>
                                <span className={cn(
                                    "text-sm font-bold",
                                     stepIdx <= currentStep ? 'text-primary-foreground' : 'text-gray-500'
                                )}>{step.id}</span>
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
        </div>

        <FormProvider {...form}>
            <form onSubmit={(e) => e.preventDefault()} noValidate>
                 {currentStep === 0 && <Step1_BasicDetails form={form} />}
                 {currentStep === 1 && <Step2_ArtistRequirements form={form} />}
                 {currentStep === 2 && <Step3_LocationSchedule form={form} />}
                 {currentStep === 3 && <Step4_Compensation form={form} />}
                 {currentStep === 4 && <Step6_ApplicationSettings form={form} />}
                 {currentStep === 5 && <Step7_MediaRequirements form={form} />}
                 {currentStep === 6 && (
                    <ImageUpload 
                        onUpload={(url) => form.setValue('imageUrl', url)}
                        storagePath="gig-images"
                        label="Upload Gig Image"
                    />
                 )}
                 {currentStep === 7 && <Step8_ReviewPublish />}

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
                                onClick={() => {
                                    form.setValue('status', 'draft');
                                    form.handleSubmit(processForm)();
                                }}
                                disabled={isSubmitting} 
                                variant="secondary"
                            >
                                {isSubmitting && form.getValues().status === 'draft' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                Save as Draft
                            </Button>
                            <Button 
                                type="button" 
                                onClick={() => {
                                    form.setValue('status', 'active');
                                    form.handleSubmit(processForm)();
                                }} 
                                disabled={isSubmitting} 
                                className="bg-gradient-to-r from-purple-500 to-orange-500 text-white font-bold"
                            >
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
            </form>
        </FormProvider>
    </div>
  );
}

    
