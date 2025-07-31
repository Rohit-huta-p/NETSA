
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

    // Company Info
    companyName: z.string().min(1, 'Company name is required'),
    jobTitle: z.string().min(1, 'Job title is required'),
    companyDescription: z.string().optional(),
    companyWebsite: z.string().url('Invalid URL').optional(),
    companyLogoUrl: z.string().url('Invalid URL').optional(),
    industry: z.enum(['entertainment', 'advertising', 'events', 'theater', 'film', 'tv', 'music', 'other']).optional(),
    companySize: z.enum(['startup', 'small', 'medium', 'large', 'enterprise']).optional(),

    // Company Location
    companyCity: z.string().optional(),
    companyCountry: z.string().optional(),

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

const industries = ['entertainment', 'advertising', 'events', 'theater', 'film', 'tv', 'music', 'other'];
const companySizes = ['startup', 'small', 'medium', 'large', 'enterprise'];

export default function RecruiterRegistrationForm() {
  const { toast } = useToast();
  const router = useRouter();
  const { setUser } = useUserStore();

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
    },
  });

  const { mutate: signUp, isPending } = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
        const { email, password, confirmPassword, agreeToTerms, ...profileData } = values;

        const now = new Date();
        const finalProfileData = {
          ...profileData,
          role: 'recruiter',
          isVerified: false,
          createdAt: now,
          updatedAt: now,
          lastActive: now,
          stats: {
            jobsPosted: 0,
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
            description: "Your recruiter account has been created.",
        });
        router.push('/dashboard');
        router.refresh();
    },
    onError: (error) => {
        toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: error.message,
        });
    },
});

const onSubmit = (values: z.infer<typeof formSchema>) => {
    signUp(values);
};


  return (
    <div className="w-full max-w-2xl mx-auto">
      <Link
        href="/"
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
          Recruiter Registration
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
            <FormField control={form.control} name="profileImageUrl" render={({ field }) => (<FormItem><FormLabel>Profile Image URL</FormLabel><FormControl><Input placeholder="https://your-domain.com/profile.jpg" {...field} /></FormControl><FormMessage /></FormItem>)} />
            <hr className="my-8" />

            <h2 className="text-2xl font-bold text-center">Company Information</h2>
            <FormField control={form.control} name="companyName" render={({ field }) => (<FormItem><FormLabel>Company/Organization Name *</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="jobTitle" render={({ field }) => (<FormItem><FormLabel>Your Job Title *</FormLabel><FormControl><Input placeholder="e.g. Casting Manager" {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="companyDescription" render={({ field }) => (<FormItem><FormLabel>Company Description</FormLabel><FormControl><Textarea placeholder="Tell us about your company..." {...field}/></FormControl><FormMessage /></FormItem>)}/>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField control={form.control} name="companyWebsite" render={({ field }) => (<FormItem><FormLabel>Company Website</FormLabel><FormControl><Input placeholder="https://companyname.com" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="companyLogoUrl" render={({ field }) => (<FormItem><FormLabel>Company Logo URL</FormLabel><FormControl><Input placeholder="https://companyname.com/logo.png" {...field} /></FormControl><FormMessage /></FormItem>)} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField control={form.control} name="industry" render={({ field }) => (<FormItem><FormLabel>Industry</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select industry" /></SelectTrigger></FormControl><SelectContent>{industries.map(i => <SelectItem key={i} value={i} className="capitalize">{i}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="companySize" render={({ field }) => (<FormItem><FormLabel>Company Size</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select company size" /></SelectTrigger></FormControl><SelectContent>{companySizes.map(s => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>)} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField control={form.control} name="companyCity" render={({ field }) => (<FormItem><FormLabel>Company City</FormLabel><FormControl><Input placeholder="e.g. New York" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="companyCountry" render={({ field }) => (<FormItem><FormLabel>Company Country</FormLabel><FormControl><Input placeholder="e.g. USA" {...field} /></FormControl><FormMessage /></FormItem>)} />
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
                {isPending ? 'Creating Account...' : 'Create Recruiter Account'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
