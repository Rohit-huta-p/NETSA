
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../../components/ui/form';
import { Input } from '../../../components/ui/input';
import { Textarea } from '../../../components/ui/textarea';
import { addUserProfile } from '@/lib/firebase/firestore';
import { signUpWithEmailAndPassword } from '@/lib/firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

const formSchema = z
  .object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.string().email('Invalid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters long'),
    confirmPassword: z.string(),
    phoneNumber: z.string().optional(),
    companyName: z.string().min(1, 'Company name is required'),
    jobTitle: z.string().min(1, 'Job title is required'),
    companyDescription: z.string().optional(),
    companyWebsite: z.string().url('Invalid URL').optional(),
    industry: z.string().optional(),
    companySize: z.string().optional(),
    agreeToTerms: z.boolean().refine((val) => val, {
      message: 'You must agree to the terms and conditions',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export default function RecruiterRegistrationForm() {
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      phoneNumber: '',
      companyName: '',
      jobTitle: '',
      companyDescription: '',
      companyWebsite: '',
      industry: '',
      companySize: '',
      agreeToTerms: false,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const { email, password, ...profileData } = values;

    const { user, error: authError } = await signUpWithEmailAndPassword(email, password);

    if (authError) {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: authError,
      });
      return;
    }

    if (user) {
      const { error: profileError } = await addUserProfile(user.uid, {
        ...profileData,
        role: 'recruiter',
      });
      if (profileError) {
        toast({
          variant: 'destructive',
          title: 'Uh oh! Something went wrong.',
          description: profileError,
        });
        return;
      }

      toast({
        title: 'Success!',
        description: 'Your recruiter account has been created.',
      });
      router.push('/dashboard');
    }
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
        <h2 className="text-2xl font-bold mb-8 text-center">Create Your Recruiter Profile</h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name *</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
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
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
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
                  <FormControl>
                    <Input type="email" {...field} />
                  </FormControl>
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
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
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
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input type="tel" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <hr className="my-8" />

            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company/Organization Name *</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="jobTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Job Title *</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Casting Manager" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
                control={form.control}
                name="companyDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell us about your company and what kind of talent you're looking for..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                    control={form.control}
                    name="companyWebsite"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Company Website</FormLabel>
                        <FormControl>
                        <Input placeholder="https://companyname.com" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="industry"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Industry</FormLabel>
                        <FormControl>
                        <Input placeholder="e.g. Entertainment, Music" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
            </div>
             <FormField
                control={form.control}
                name="companySize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Size</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. 1-10, 11-50, 50+" {...field} />
                    </FormControl>
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
              >
                Create Recruiter Account
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
