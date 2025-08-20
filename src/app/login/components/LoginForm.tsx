
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LogIn } from 'lucide-react';
import { signInWithEmailAndPassword } from '@/lib/firebase/auth';
import { useMutation } from '@tanstack/react-query';
import { useUserStore } from '@/store/userStore';
import { addUserProfile, getUserProfile } from '@/lib/firebase/firestore';
import Cookies from 'js-cookie';
import { useLoaderStore } from '@/store/loaderStore';
import { handleAppError } from '@/lib/errorHandler';

const formSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export default function LoginForm() {
  const { toast } = useToast();
  const { setUser } = useUserStore();
  const { setLoading } = useLoaderStore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const { mutate: signIn, isPending } = useMutation({
    mutationFn: async ({ email, password }: z.infer<typeof formSchema>) => {
      setLoading(true);
      const { user, error } = await signInWithEmailAndPassword(email, password);
      if (error) throw new Error(error);
      return user;
    },
    onSuccess: async (user) => {
        if(user) {
            let { data, error } = await getUserProfile(user.uid);
            
            // This is the recovery logic for "orphaned" accounts.
            if (error) {
                toast({
                    title: 'Account Recovery',
                    description: "We're setting up your profile. Please wait a moment.",
                });
                const [firstName, lastName] = user.email?.split('@')[0].split('.') || ['New', 'User'];
                const now = new Date();
                // Create a default 'artist' profile. The user can later contact support to change roles if needed.
                const defaultProfileData = {
                    id: user.uid,
                    firstName: firstName || 'New',
                    lastName: lastName || 'User',
                    email: user.email,
                    role: 'artist' as const,
                    isVerified: false,
                    createdAt: now,
                    updatedAt: now,
                    lastActive: now,
                    artistType: 'other' as const,
                    city: '',
                    country: '',
                    phoneNumber: '',
                    profileImageUrl: '',
                    languages: [],
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
                    socialMedia: { instagram: '', tiktok: '', youtube: '', spotify: '' },
                    stats: { eventsAttended: 0, eventsHosted: 0, connectionsCount: 0, averageRating: 0, totalReviews: 0, profileViews: 0, portfolioViews: 0 },
                    totalEarnings: 0,
                };
                await addUserProfile(user.uid, defaultProfileData);
                const { data: newData } = await getUserProfile(user.uid);
                data = newData;
            }

            if (!data) {
                 toast({
                    variant: 'destructive',
                    title: 'Sign In Failed',
                    description: 'Could not retrieve or create a user profile. Please contact support.',
                });
                setLoading(false);
                return;
            }
            
            const token = await user.getIdToken();
            Cookies.set('user-token', token, { expires: 1 });
            setUser({ ...user, ...data });
            toast({
              title: 'Success!',
              description: 'You have successfully signed in.',
            });
            window.location.href = '/events';
        }
    },
    onError: (error) => {
      const errorMessage = handleAppError(error, 'Login');
      toast({
        variant: 'destructive',
        title: 'Sign In Failed',
        description: errorMessage,
      });
    },
    onSettled: () => {
      setLoading(false);
    }
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    signIn(values);
  };

  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 inline-block rounded-full bg-primary/10 p-4">
          <LogIn className="h-10 w-10 text-primary" />
        </div>
        <CardTitle className="text-3xl font-bold">Welcome Back!</CardTitle>
        <CardDescription>Sign in to continue to your dashboard</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              size="lg"
              className="w-full font-bold text-base py-6 bg-gradient-to-r from-primary to-secondary text-primary-foreground hover:brightness-110"
              disabled={isPending}
            >
              {isPending ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
