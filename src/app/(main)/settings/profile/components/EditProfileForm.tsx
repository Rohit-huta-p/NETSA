
"use client"

import { useState, useRef } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, FormProvider } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, Loader2, User, Palette, Briefcase } from 'lucide-react';
import type { UserProfile } from '@/store/userStore';
import { updateUserProfile } from '@/lib/server/actions';
import { Step1_PersonalInfo } from './steps/Step1_PersonalInfo';
import { Step2_ArtistDetails } from './steps/Step2_ArtistDetails';
import { Step3_ProfessionalInfo } from './steps/Step3_ProfessionalInfo';
import { useUserStore } from '@/store/userStore';
import { useLoaderStore } from '@/store/loaderStore';

const profileFormSchema = z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    phoneNumber: z.string().optional(),
    dob: z.date().optional(),
    gender: z.enum(['male', 'female', 'other']).optional(),
    city: z.string().optional(),
    country: z.string().optional(),
    bio: z.string().optional(),
    height: z.coerce.number().optional(),
    skinTone: z.string().optional(),
    
    // Artist specific
    artistType: z.enum(['dancer', 'singer', 'model', 'musician', 'dj', 'actor', 'other']).optional(),
    experienceYears: z.coerce.number().optional(),
    skills: z.array(z.string()).optional(),
    styles: z.array(z.string()).optional(),
    genres: z.array(z.string()).optional(),
    
    // Professional Info
    agencyAffiliated: z.boolean().optional(),
    availableForBooking: z.boolean().optional(),
    travelReady: z.boolean().optional(),
    hourlyRate: z.coerce.number().optional(),
    socialMedia: z.object({
        instagram: z.string().optional(),
        tiktok: z.string().optional(),
        youtube: z.string().optional(),
        spotify: z.string().optional(),
    }).optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const steps = [
  { id: 'Step 1', name: 'Personal Info', icon: <User className="w-5 h-5"/>, fields: ['firstName', 'lastName', 'city', 'country', 'dob', 'gender', 'height', 'skinTone', 'bio'] },
  { id: 'Step 2', name: 'Artist Details', icon: <Palette className="w-5 h-5"/>, fields: ['artistType', 'experienceYears', 'skills', 'styles', 'genres'] },
  { id: 'Step 3', name: 'Professional Info', icon: <Briefcase className="w-5 h-5"/>, fields: ['agencyAffiliated', 'availableForBooking', 'travelReady', 'hourlyRate', 'socialMedia.instagram'] },
];

interface EditProfileFormProps {
    user: UserProfile;
}

export function EditProfileForm({ user }: EditProfileFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const { setLoading } = useLoaderStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setUser } = useUserStore();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    mode: 'onChange',
    defaultValues: {
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        dob: user.dob ? new Date(user.dob) : undefined,
        gender: user.gender,
        city: user.city,
        country: user.country,
        bio: user.bio,
        height: user.role === 'artist' ? user.height : undefined,
        skinTone: user.role === 'artist' ? user.skinTone : undefined,
        artistType: user.role === 'artist' ? user.artistType : undefined,
        experienceYears: user.role === 'artist' ? user.experienceYears : undefined,
        skills: user.role === 'artist' ? user.skills : [],
        styles: user.role === 'artist' ? user.styles : [],
        genres: user.role === 'artist' ? user.genres : [],
        agencyAffiliated: user.role === 'artist' ? user.agencyAffiliated : undefined,
        availableForBooking: user.role === 'artist' ? user.availableForBooking : undefined,
        travelReady: user.role === 'artist' ? user.travelReady : undefined,
        hourlyRate: user.role === 'artist' ? user.hourlyRate : undefined,
        socialMedia: {
            instagram: user.role === 'artist' ? user.socialMedia?.instagram : '',
            tiktok: user.role === 'artist' ? user.socialMedia?.tiktok : '',
            youtube: user.role === 'artist' ? user.socialMedia?.youtube : '',
            spotify: user.role === 'artist' ? user.socialMedia?.spotify : '',
        }
    },
  });

  const processSubmit = async (values: ProfileFormValues) => {
    setIsSubmitting(true);
    setLoading(true);
    
    const result = await updateUserProfile(user.id, values);

    if (result.success) {
      const updatedUser = { ...user, ...values };
      setUser(updatedUser);
      toast({ title: 'Success!', description: `Your profile has been updated.` });
      router.push(`/artist/${user.id}`);
      router.refresh();
    } else {
      toast({ variant: 'destructive', title: 'Error', description: result.error });
    }
    
    setIsSubmitting(false);
    setLoading(false);
  };

  type FieldName = keyof ProfileFormValues;

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
        <nav aria-label="Progress" className="mb-8 border-b pb-4">
            <ol role="list" className="space-y-4 md:flex md:space-x-8 md:space-y-0">
                {steps.map((step, index) => (
                <li key={step.name} className="md:flex-1">
                    <div
                        onClick={() => setCurrentStep(index)}
                        className={`group flex w-full flex-col py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4 cursor-pointer
                        ${currentStep === index ? 'border-primary' : 'border-border hover:border-muted-foreground'}`}>
                        <div className="flex items-center gap-2">
                           <div className={`p-1 rounded-full ${currentStep === index ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>{step.icon}</div>
                           <div>
                                <span className={`text-sm font-medium ${currentStep === index ? 'text-primary' : 'text-muted-foreground'}`}>{step.id}</span>
                                <span className="text-sm font-medium block">{step.name}</span>
                           </div>
                        </div>
                    </div>
                </li>
                ))}
            </ol>
        </nav>

        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(processSubmit)}>
            {currentStep === 0 && <Step1_PersonalInfo form={form} />}
            {currentStep === 1 && <Step2_ArtistDetails form={form} />}
            {currentStep === 2 && <Step3_ProfessionalInfo form={form} />}
            
            <div className="mt-8 pt-5 border-t">
                <div className="flex justify-between">
                <Button type="button" onClick={prev} disabled={currentStep === 0 || isSubmitting} variant="outline">
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Back
                </Button>
                
                {currentStep === steps.length - 1 ? (
                    <Button 
                        type="submit" 
                        disabled={isSubmitting} 
                        className="bg-gradient-to-r from-purple-500 to-orange-500 text-white font-bold"
                    >
                        {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Save Changes
                    </Button>
                ) : (
                    <Button type="button" onClick={next} disabled={isSubmitting}>
                        Next Step
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
