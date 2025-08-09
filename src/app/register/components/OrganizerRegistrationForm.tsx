
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Users } from 'lucide-react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '../../../components/ui/button';
import { Checkbox } from '../../../components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../../components/ui/form';
import { Input } from '../../../components/ui/input';
import { addUserProfile, getUserProfile } from '@/lib/firebase/firestore';
import { signUpWithEmailAndPassword } from '@/lib/firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { useUserStore } from '@/store/userStore';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLoaderStore } from '@/store/loaderStore';

const formSchema = z
  .object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters long'),
    confirmPassword: z.string(),
    organizationType: z.enum(['company', 'individual', 'agency', 'institution', 'event_management']),
    agreeToTerms: z.boolean().refine((val) => val, {
      message: 'You must agree to the terms and conditions',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

const organizationTypes = ['company', 'individual', 'agency', 'institution', 'event_management'];

export default function OrganizerRegistrationForm() {
  const { toast } = useToast();
  const router = useRouter();
  const { setUser } = useUserStore();
  const { setLoading } = useLoaderStore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      organizationType: undefined,
      agreeToTerms: false,
    },
  });

  const { mutate: signUp, isPending } = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
        setLoading(true);
        const { email, password } = values;
        const { user, error } = await signUpWithEmailAndPassword(email, password);
        if (error) throw new Error(error);
        if (!user) throw new Error("User not created");
        return user;
    },
    onSuccess: async (user) => {
        const values = form.getValues();
        const { email, password, confirmPassword, agreeToTerms, ...profileData } = values;

        const now = new Date();
        const finalProfileData = {
          ...profileData,
          role: 'organizer' as const,
          isVerified: false,
          createdAt: now,
          updatedAt: now,
          lastActive: now,
          phoneNumber: '',
          profileImageUrl: '',
          organizationName: '',
          jobTitle: '',
          organizationDescription: '',
          organizationWebsite: '',
          organizationLogoUrl: '',
          industry: undefined,
          organizationSize: undefined,
          city: '',
          country: '',
          yearsInIndustry: 0,
          specialization: [],
          preferredArtistTypes: [],
          stats: {
            opportunitiesPosted: 0,
            eventsCreated: 0,
            artistsHired: 0,
            eventsOrganized: 0,
            connectionsCount: 0,
            averageRating: 0,
            totalReviews: 0,
            responseRate: 0,
          },
          socialMedia: {
            linkedin: '',
            instagram: '',
            website: '',
          },
          totalSpent: 0,
        };
        
        await addUserProfile(user.uid, finalProfileData);

        const token = await user.getIdToken();
        Cookies.set('user-token', token, { expires: 1 });
        const { data: newProfile } = await getUserProfile(user.uid);
        
        if (newProfile) {
          setUser({ ...user, ...newProfile });
          toast({
              title: "Welcome to TalentMatch!",
              description: "Your organizer account has been created. Let's find some talent!",
          });
          window.location.href = '/events';
        } else {
            toast({
                variant: "destructive",
                title: "Registration Failed",
                description: "Could not create your user profile. Please try again.",
            });
        }
    },
    onError: async (error: any) => {
      toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: error.message.includes('email-already-in-use')
              ? 'This email is already registered. Please log in.'
              : error.message,
      });
    },
    onSettled: () => {
        setLoading(false);
    }
});

const onSubmit = (values: z.infer<typeof formSchema>) => {
    signUp(values);
};


  return (
    <div className="w-full max-w-lg mx-auto">
      <Link
        href="/register"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to role selection
      </Link>
      <div className="text-center my-8">
        <div className="inline-block p-4 bg-[#FFEDD5] rounded-full">
          <Users className="w-10 h-10 text-[#FB7185]" />
        </div>
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FB7185] to-[#EA580C] mt-4">
          Organizer Registration
        </h1>
        <p className="text-muted-foreground mt-2">
          Find the perfect talent for your next project.
        </p>
      </div>

      <div className="bg-card p-8 sm:p-10 rounded-lg border shadow-sm">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField control={form.control} name="firstName" render={({ field }) => (<FormItem><FormLabel>First Name *</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="lastName" render={({ field }) => (<FormItem><FormLabel>Last Name *</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
            </div>

            <FormField control={form.control} name="email" render={({ field }) => (<FormItem><FormLabel>Email Address *</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>)} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField control={form.control} name="password" render={({ field }) => (<FormItem><FormLabel>Password *</FormLabel><FormControl><Input type="password" {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="confirmPassword" render={({ field }) => (<FormItem><FormLabel>Confirm Password *</FormLabel><FormControl><Input type="password" {...field} /></FormControl><FormMessage /></FormItem>)} />
            </div>

            <FormField
                control={form.control}
                name="organizationType"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>You are registering as a... *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Select your role type" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        {organizationTypes.map(type => <SelectItem key={type} value={type} className="capitalize">{type.replace('_', ' ')}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
            />
            
            <FormField
              control={form.control}
              name="agreeToTerms"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 pt-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      I agree to the{' '}
                      <Link
                        href="/terms"
                        className="text-primary hover:underline"
                      >
                        Terms of Service
                      </Link>
                    </FormLabel>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <div className="pt-4">
              <Button
                type="submit"
                size="lg"
                className="w-full font-bold text-base py-6 bg-gradient-to-r from-[#FB7185] to-[#EA580C] hover:from-[#FB7185]/90 hover:to-[#EA580C]/90"
                disabled={isPending}
              >
                {isPending ? 'Creating Account...' : 'Create Organizer Account'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
