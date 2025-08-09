
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Palette } from 'lucide-react';
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
import { signUpWithEmailAndPassword } from '@/lib/firebase/auth';
import { addUserProfile, getUserProfile } from '@/lib/firebase/firestore';
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
    artistType: z.enum(['dancer', 'singer', 'model', 'musician', 'dj', 'actor', 'other']),
    agreeToTerms: z.boolean().refine((val) => val, {
      message: 'You must agree to the terms and conditions',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

const artistTypes = ['dancer', 'singer', 'model', 'musician', 'dj', 'actor', 'other'];

export default function ArtistRegistrationForm() {
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
      artistType: undefined,
      agreeToTerms: false,
    },
  });

    const { mutate: signUp, isPending } = useMutation({
        mutationFn: async (values: z.infer<typeof formSchema>) => {
            setLoading(true);
            const { email, password, confirmPassword, ...profileData } = values;

            const now = new Date();
            const finalProfileData = {
                ...profileData,
                role: 'artist' as const,
                isVerified: false,
                createdAt: now,
                updatedAt: now,
                lastActive: now,
                phoneNumber: '',
                profileImageUrl: '',
                dob: undefined,
                gender: undefined,
                city: '',
                country: '',
                languages: [],
                otherArtistType: '',
                bio: '',
                experienceYears: 0,
                skills: [],
                styles: [],
                genres: [],
                instruments: [],
                otherSkill: '',
                agencyAffiliated: false,
                availableForBooking: true,
                preferredCities: [],
                travelReady: false,
                remoteWorkOk: false,
                hourlyRate: 0,
                currency: '',
                portfolioLinks: '',
                resumeUrl: '',
                socialMedia: {
                    instagram: '',
                    tiktok: '',
                    youtube: '',
                    spotify: '',
                },
                stats: {
                    eventsAttended: 0,
                    eventsHosted: 0,
                    connectionsCount: 0,
                    averageRating: 0,
                    totalReviews: 0,
                    profileViews: 0,
                    portfolioViews: 0,
                },
            };
            
            const { user, error: authError } = await signUpWithEmailAndPassword(email, password);
            if (authError && authError.includes('email-already-in-use')) {
                // This case is handled in onError, but we throw a specific error for clarity.
                throw new Error('This email is already registered. Please log in.');
            }
            if (authError) throw new Error(authError);
            if (!user) throw new Error("User not created");

            // Check if a profile already exists. This can happen if account creation
            // succeeded but profile creation failed on a previous attempt.
            const { data: existingProfile } = await getUserProfile(user.uid);
            if (!existingProfile) {
              await addUserProfile(user.uid, finalProfileData);
            }
            
            return user;
        },
        onSuccess: async (user) => {
            const token = await user.getIdToken();
            Cookies.set('user-token', token, { expires: 1 });
            const { data } = await getUserProfile(user.uid);
            if(data) {
              setUser({ ...user, ...data });
              toast({
                  title: "Welcome to TalentMatch!",
                  description: "Your artist account has been created. Let's find your next opportunity!",
              });
              window.location.href = '/events';
            } else {
              // This case should ideally not be reached due to the logic above, but it's a safeguard.
               toast({
                variant: "destructive",
                title: "Registration Failed",
                description: "Could not create your user profile. Please try again.",
            });
            }
        },
        onError: (error: any) => {
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: error.message,
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
        <div className="inline-block p-4 bg-primary/10 rounded-full">
          <Palette className="w-10 h-10 text-primary" />
        </div>
        <h1 className="text-4xl font-bold text-primary mt-4">
          Artist Registration
        </h1>
        <p className="text-muted-foreground mt-2">
          Let's get you set up. You can add more details later.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 bg-card p-8 rounded-lg border shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name *</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name *</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address *</FormLabel>
                <FormControl><Input type="email" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password *</FormLabel>
                  <FormControl><Input type="password" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password *</FormLabel>
                  <FormControl><Input type="password" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
              control={form.control}
              name="artistType"
              render={({ field }) => (
                  <FormItem>
                  <FormLabel>What kind of artist are you? *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                      <SelectTrigger>
                          <SelectValue placeholder="Select your primary discipline" />
                      </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                      {artistTypes.map(type => <SelectItem key={type} value={type} className="capitalize">{type}</SelectItem>)}
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

          <Button
            type="submit"
            size="lg"
            className="w-full font-bold text-base py-6 bg-gradient-to-r from-[#8B5CF6] via-[#EC4899] to-[#F59E0B] hover:from-[#8B5CF6]/90 hover:via-[#EC4899]/90 hover:to-[#F59E0B]/90"
            disabled={isPending}
          >
            {isPending ? 'Creating Account...' : 'Create Artist Account'}
          </Button>
        </form>
      </Form>
    </div>
  );
}
