
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
import { useRouter } from 'next/navigation';
import { useLoaderStore } from '@/store/loaderStore';

const formSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export default function LoginForm() {
  const { toast } = useToast();
  const router = useRouter();
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
            
            if (error) {
                // Profile doesn't exist, let's create a default one.
                // This handles orphaned auth accounts.
                const [firstName, lastName] = user.email?.split('@')[0].split('.') || ['New', 'User'];
                const now = new Date();
                const defaultProfileData = {
                    firstName: firstName || 'New',
                    lastName: lastName || 'User',
                    email: user.email,
                    role: 'artist' as const, // Default to artist, they can change it later
                    isVerified: false,
                    createdAt: now,
                    updatedAt: now,
                    lastActive: now,
                    artistType: 'other',
                    city: '',
                    country: '',
                    stats: {
                        eventsAttended: 0, eventsHosted: 0, connectionsCount: 0,
                        averageRating: 0, totalReviews: 0, profileViews: 0, portfolioViews: 0,
                    }
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
      toast({
        variant: 'destructive',
        title: 'Sign In Failed',
        description: error.message,
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
              className="w-full font-bold text-base py-6 bg-gradient-to-r from-[#8B5CF6] via-[#EC4899] to-[#F59E0B] hover:from-[#8B5CF6]/90 hover:via-[#EC4899]/90 hover:to-[#F59E0B]/90"
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
