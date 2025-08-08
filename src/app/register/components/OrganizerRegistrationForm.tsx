
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
import { Textarea } from '../../../components/ui/textarea';
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
    // Basic Info
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.string().email('Invalid email address'),
    phoneNumber: z.string().optional(),
    profileImageUrl: z.string().url('Invalid URL').optional(),

    // Account Details
    password: z.string().min(8, 'Password must be at least 8 characters long'),
    confirmPassword: z.string(),

    // Organization Info
    organizationType: z.enum(['company', 'individual', 'agency', 'institution', 'event_management']),
    organizationName: z.string().optional(),
    jobTitle: z.string().optional(),
    organizationDescription: z.string().optional(),
    organizationWebsite: z.string().url('Invalid URL').optional(),
    organizationLogoUrl: z.string().url('Invalid URL').optional(),
    industry: z.enum(['entertainment', 'advertising', 'events', 'theater', 'film', 'tv', 'music', 'education', 'other']).optional(),
    organizationSize: z.enum(['individual', 'small', 'medium', 'large', 'enterprise']).optional(),

    // Location
    city: z.string().optional(),
    country: z.string().optional(),

    // Professional Info
    yearsInIndustry: z.coerce.number().optional(),
    specialization: z.array(z.string()).optional(),
    preferredArtistTypes: z.array(z.string()).optional(),

    // Social Media
    linkedin: z.string().optional(),
    instagram: z.string().optional(),
    website: z.string().optional(),

    agreeToTerms: z.boolean().refine((val) => val, {
      message: 'You must agree to the terms and conditions',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

const organizationTypes = ['company', 'individual', 'agency', 'institution', 'event_management'];
const industries = ['entertainment', 'advertising', 'events', 'theater', 'film', 'tv', 'music', 'education', 'other'];
const organizationSizes = ['individual', 'small', 'medium', 'large', 'enterprise'];

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
      specialization: [],
      preferredArtistTypes: [],
      agreeToTerms: false,
      phoneNumber: '',
      profileImageUrl: '',
      organizationName: '',
      jobTitle: '',
      organizationDescription: '',
      organizationWebsite: '',
      organizationLogoUrl: '',
      city: '',
      country: '',
      linkedin: '',
      instagram: '',
      website: '',
    },
  });

  const { mutate: signUp, isPending } = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
        setLoading(true);
        const { email, password, confirmPassword, agreeToTerms, ...profileData } = values;

        const now = new Date();
        const finalProfileData = {
          ...profileData,
          role: 'organizer',
          isVerified: false,
          createdAt: now,
          updatedAt: now,
          lastActive: now,
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
            linkedin: profileData.linkedin,
            instagram: profileData.instagram,
            website: profileData.website,
          },
        };
        
        delete (finalProfileData as any).linkedin;
        delete (finalProfileData as any).instagram;
        delete (finalProfileData as any).website;

        const { user, error: authError } = await signUpWithEmailAndPassword(email, password);
        if (authError) throw new Error(authError);
        if (!user) throw new Error("User not created");

        const { error: profileError } = await addUserProfile(user.uid, finalProfileData);
        if (profileError) throw new Error(profileError);
        return user;
    },
    onSuccess: async (user) => {
        const token = await user.getIdToken();
        Cookies.set('user-token', token, { expires: 1 });
        const { data } = await getUserProfile(user.uid);
        setUser({ ...user, ...data });
        toast({
            title: "Success!",
            description: "Your organizer account has been created.",
        });
        window.location.href = '/events';
    },
    onError: (error) => {
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
    <div className="w-full max-w-2xl mx-auto">
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
          Find the perfect talent for your next project
        </p>
      </div>

      <div className="bg-card p-8 sm:p-10 rounded-lg border shadow-sm">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <h2 className="text-2xl font-bold text-center">Your Profile</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField control={form.control} name="firstName" render={({ field }) => (<FormItem><FormLabel>First Name *</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="lastName" render={({ field }) => (<FormItem><FormLabel>Last Name *</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
            </div>

            <FormField control={form.control} name="email" render={({ field }) => (<FormItem><FormLabel>Email Address *</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>)} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField control={form.control} name="password" render={({ field }) => (<FormItem><FormLabel>Password *</FormLabel><FormControl><Input type="password" {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="confirmPassword" render={({ field }) => (<FormItem><FormLabel>Confirm Password *</FormLabel><FormControl><Input type="password" {...field} /></FormControl><FormMessage /></FormItem>)} />
            </div>

            <FormField control={form.control} name="phoneNumber" render={({ field }) => (<FormItem><FormLabel>Phone Number</FormLabel><FormControl><Input type="tel" {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="profileImageUrl" render={({ field }) => (<FormItem><FormLabel>Upload Profile Image URL</FormLabel><FormControl><Input placeholder="https://your-domain.com/profile.jpg" {...field} /></FormControl><FormMessage /></FormItem>)} />
            <hr className="my-8" />

            <h2 className="text-2xl font-bold text-center">Organization Information</h2>
            <FormField
                control={form.control}
                name="organizationType"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Organization Type *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Select your organization type" />
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
            <FormField control={form.control} name="organizationName" render={({ field }) => (<FormItem><FormLabel>Organization/Brand Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="jobTitle" render={({ field }) => (<FormItem><FormLabel>Your Job Title</FormLabel><FormControl><Input placeholder="e.g. Casting Manager" {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="organizationDescription" render={({ field }) => (<FormItem><FormLabel>Organization Description</FormLabel><FormControl><Textarea placeholder="Tell us about your organization..." {...field}/></FormControl><FormMessage /></FormItem>)}/>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField control={form.control} name="organizationWebsite" render={({ field }) => (<FormItem><FormLabel>Organization Website</FormLabel><FormControl><Input placeholder="https://companyname.com" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="organizationLogoUrl" render={({ field }) => (<FormItem><FormLabel>Organization Logo URL</FormLabel><FormControl><Input placeholder="https://companyname.com/logo.png" {...field} /></FormControl><FormMessage /></FormItem>)} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField control={form.control} name="industry" render={({ field }) => (<FormItem><FormLabel>Industry</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select industry" /></SelectTrigger></FormControl><SelectContent>{industries.map(i => <SelectItem key={i} value={i} className="capitalize">{i}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="organizationSize" render={({ field }) => (<FormItem><FormLabel>Organization Size</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select organization size" /></SelectTrigger></FormControl><SelectContent>{organizationSizes.map(s => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>)} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField control={form.control} name="city" render={({ field }) => (<FormItem><FormLabel>City</FormLabel><FormControl><Input placeholder="e.g. New York" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="country" render={({ field }) => (<FormItem><FormLabel>Country</FormLabel><FormControl><Input placeholder="e.g. USA" {...field} /></FormControl><FormMessage /></FormItem>)} />
            </div>

            <hr className="my-8" />
            <h2 className="text-2xl font-bold text-center">Professional Details</h2>
            <FormField control={form.control} name="yearsInIndustry" render={({ field }) => (<FormItem><FormLabel>Years in Industry</FormLabel><FormControl><Input type="number" placeholder="e.g. 10" {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="specialization" render={({ field }) => (<FormItem><FormLabel>Specialization (comma separated)</FormLabel><FormControl><Input placeholder="e.g. Dancers, Actors" {...field} onChange={e => field.onChange(e.target.value.split(',').map(s => s.trim()))} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="preferredArtistTypes" render={({ field }) => (<FormItem><FormLabel>Preferred Artist Types (comma separated)</FormLabel><FormControl><Input placeholder="e.g. Contemporary Dancers, Voice Actors" {...field} onChange={e => field.onChange(e.target.value.split(',').map(s => s.trim()))} /></FormControl><FormMessage /></FormItem>)} />

            <hr className="my-8" />
            <h2 className="text-2xl font-bold text-center">Social Media</h2>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField control={form.control} name="linkedin" render={({ field }) => (<FormItem><FormLabel>LinkedIn</FormLabel><FormControl><Input placeholder="e.g. linkedin.com/in/username" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="instagram" render={({ field }) => (<FormItem><FormLabel>Instagram</FormLabel><FormControl><Input placeholder="e.g. instagram.com/company" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="website" render={({ field }) => (<FormItem><FormLabel>Website</FormLabel><FormControl><Input placeholder="e.g. yourcompany.com" {...field} /></FormControl><FormMessage /></FormItem>)} />
            </div>


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
                      </Link>{' '}
                      and{' '}
                      <Link
                        href="/privacy"
                        className="text-primary hover:underline"
                      >
                        Privacy Policy
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

    