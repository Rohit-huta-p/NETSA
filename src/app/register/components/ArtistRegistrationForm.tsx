
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, CalendarIcon, Palette } from 'lucide-react';
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
import { RadioGroup, RadioGroupItem } from '../../../components/ui/radio-group';
import { Textarea } from '../../../components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '../../../components/ui/popover';
import { Calendar } from '../../../components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Switch } from '../../../components/ui/switch';
import { signUpWithEmailAndPassword } from '@/lib/firebase/auth';
import { addUserProfile, getUserProfile } from '@/lib/firebase/firestore';
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
    
    // Personal Info
    dob: z.date().optional(),
    gender: z.enum(['male', 'female', 'other']).optional(),
    city: z.string().optional(),
    country: z.string().optional(),
    languages: z.array(z.string()).optional(),
    
    // Artist Profile
    artistType: z.enum(['dancer', 'singer', 'model', 'musician', 'dj', 'actor', 'other']),
    otherArtistType: z.string().optional(),
    bio: z.string().optional(),
    experienceYears: z.coerce.number().optional(),
    
    // Skills & Expertise
    skills: z.array(z.string()).optional(),
    styles: z.array(z.string()).optional(),
    genres: z.array(z.string()).optional(),
    instruments: z.array(z.string()).optional(),
    otherSkill: z.string().optional(),
    
    // Professional Info
    agencyAffiliated: z.boolean().default(false),
    availableForBooking: z.boolean().default(true),
    preferredCities: z.array(z.string()).optional(),
    travelReady: z.boolean().default(false),
    remoteWorkOk: z.boolean().default(false),
    hourlyRate: z.coerce.number().optional(),
    currency: z.string().optional(),
    
    // Portfolio Links
    portfolioLinks: z.string().optional(),
    resumeUrl: z.string().url('Invalid URL').optional(),
    
    // Social Media
    instagram: z.string().optional(),
    tiktok: z.string().optional(),
    youtube: z.string().optional(),
    spotify: z.string().optional(),
    
    agreeToTerms: z.boolean().refine((val) => val, {
      message: 'You must agree to the terms and conditions',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })
  .refine((data) => {
    if (data.artistType === 'other') {
      return !!data.otherArtistType;
    }
    return true;
  }, {
    message: 'Please specify your artist type',
    path: ['otherArtistType'],
  })
  .refine((data) => {
    if (data.skills?.includes('Other')) {
        return !!data.otherSkill;
    }
    return true;
  }, {
    message: 'Please specify your skill',
    path: ['otherSkill'],
  });

const artistTypes = ['dancer', 'singer', 'model', 'musician', 'dj', 'actor', 'other'];

export default function ArtistRegistrationForm() {
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
      artistType: undefined,
      agencyAffiliated: false,
      availableForBooking: true,
      travelReady: false,
      remoteWorkOk: false,
      agreeToTerms: false,
      phoneNumber: '',
      profileImageUrl: '',
      city: '',
      country: '',
      languages: [],
      otherArtistType: '',
      bio: '',
      skills: [],
      styles: [],
      genres: [],
      instruments: [],
      otherSkill: '',
      preferredCities: [],
      currency: '',
      portfolioLinks: '',
      resumeUrl: '',
      instagram: '',
      tiktok: '',
      youtube: '',
      spotify: '',
    },
  });

  const watchedArtistType = form.watch('artistType');

    const { mutate: signUp, isPending } = useMutation({
        mutationFn: async (values: z.infer<typeof formSchema>) => {
            const { email, password, confirmPassword, agreeToTerms, ...profileData } = values;

            const now = new Date();
            const finalProfileData = {
                ...profileData,
                role: 'artist',
                isVerified: false,
                createdAt: now,
                updatedAt: now,
                lastActive: now,
                stats: {
                    eventsAttended: 0,
                    eventsHosted: 0,
                    connectionsCount: 0,
                    averageRating: 0,
                    totalReviews: 0,
                    profileViews: 0,
                    portfolioViews: 0,
                },
                socialMedia: {
                    instagram: profileData.instagram,
                    tiktok: profileData.tiktok,
                    youtube: profileData.youtube,
                    spotify: profileData.spotify,
                }
            };
            
            // remove social media fields from top level
            delete (finalProfileData as any).instagram;
            delete (finalProfileData as any).tiktok;
            delete (finalProfileData as any).youtube;
            delete (finalProfileData as any).spotify;


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
                description: "Your artist account has been created.",
            });
            router.push('/events');
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
    <div className="w-full max-w-4xl mx-auto">
      <Link
        href="/"
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
          Tell us about yourself and your artistic journey
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-card p-8 rounded-lg border shadow-sm">
            <h2 className="text-2xl font-bold mb-6">Basic Information</h2>
            <div className="space-y-6">
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
                name="profileImageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Profile Image URL</FormLabel>
                    <FormControl><Input placeholder="https://your-domain.com/profile-photo.jpg" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Personal Information */}
          <div className="bg-card p-8 rounded-lg border shadow-sm">
            <h2 className="text-2xl font-bold mb-6">Personal Information</h2>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="dob"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date of birth</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={'outline'}
                              className={cn('w-full pl-3 text-left font-normal',!field.value && 'text-muted-foreground')}
                            >
                              {field.value ? (format(field.value, 'PPP')) : (<span>Select your date of birth</span>)}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            captionLayout="dropdown-buttons"
                            fromYear={new Date().getFullYear() - 80}
                            toYear={new Date().getFullYear()}
                            disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Gender</FormLabel>
                      <FormControl>
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex space-x-4">
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl><RadioGroupItem value="male" /></FormControl>
                            <FormLabel className="font-normal">Male</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl><RadioGroupItem value="female" /></FormControl>
                            <FormLabel className="font-normal">Female</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl><RadioGroupItem value="other" /></FormControl>
                            <FormLabel className="font-normal">Other</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField control={form.control} name="city" render={({ field }) => (<FormItem><FormLabel>City</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="country" render={({ field }) => (<FormItem><FormLabel>Country</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
              </div>
               <FormField control={form.control} name="languages" render={({ field }) => (<FormItem><FormLabel>Languages (comma separated)</FormLabel><FormControl><Input placeholder="e.g. English, Spanish" {...field} onChange={e => field.onChange(e.target.value.split(',').map(s => s.trim()))} /></FormControl><FormMessage /></FormItem>)} />
            </div>
          </div>
          
          {/* Artist Profile */}
          <div className="bg-card p-8 rounded-lg border shadow-sm">
            <h2 className="text-2xl font-bold mb-6">Artist Profile</h2>
            <div className="space-y-6">
                <FormField
                    control={form.control}
                    name="artistType"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Artist Type *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select your primary artistic discipline" />
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
              {watchedArtistType === 'other' && (
                <FormField control={form.control} name="otherArtistType" render={({ field }) => (<FormItem><FormLabel>Please specify</FormLabel><FormControl><Input {...field} placeholder="e.g., Stunt Performer" /></FormControl><FormMessage /></FormItem>)} />
              )}
              <FormField control={form.control} name="bio" render={({ field }) => (<FormItem><FormLabel>Bio</FormLabel><FormControl><Textarea placeholder="Tell us about yourself, your passion for the arts..." {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="experienceYears" render={({ field }) => (<FormItem><FormLabel>Years of Experience</FormLabel><FormControl><Input type="number" placeholder="e.g., 5" {...field} /></FormControl><FormMessage /></FormItem>)} />
            
              <FormField control={form.control} name="skills" render={({ field }) => (<FormItem><FormLabel>Skills (comma separated)</FormLabel><FormControl><Input placeholder="e.g., Contemporary, Hip-Hop" {...field} onChange={e => field.onChange(e.target.value.split(',').map(s => s.trim()))} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="styles" render={({ field }) => (<FormItem><FormLabel>Styles (comma separated)</FormLabel><FormControl><Input placeholder="e.g., Popping, Lyrical" {...field} onChange={e => field.onChange(e.target.value.split(',').map(s => s.trim()))} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="genres" render={({ field }) => (<FormItem><FormLabel>Genres (comma separated)</FormLabel><FormControl><Input placeholder="e.g., Pop, Rock, Jazz" {...field} onChange={e => field.onChange(e.target.value.split(',').map(s => s.trim()))} /></FormControl><FormMessage /></FormItem>)} />
              {watchedArtistType === 'musician' && <FormField control={form.control} name="instruments" render={({ field }) => (<FormItem><FormLabel>Instruments (comma separated)</FormLabel><FormControl><Input placeholder="e.g., Guitar, Piano" {...field} onChange={e => field.onChange(e.target.value.split(',').map(s => s.trim()))} /></FormControl><FormMessage /></FormItem>)} />}
            </div>
          </div>
          
          {/* Professional Information */}
           <div className="bg-card p-8 rounded-lg border shadow-sm">
            <h2 className="text-2xl font-bold mb-6">Professional Information</h2>
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField control={form.control} name="hourlyRate" render={({ field }) => (<FormItem><FormLabel>Hourly Rate</FormLabel><FormControl><Input type="number" placeholder="e.g., 50" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="currency" render={({ field }) => (<FormItem><FormLabel>Currency</FormLabel><FormControl><Input placeholder="e.g., USD" {...field} /></FormControl><FormMessage /></FormItem>)} />
                </div>
                 <FormField
                    control={form.control}
                    name="preferredCities"
                    render={({ field }) => (<FormItem><FormLabel>Preferred Work Cities (comma separated)</FormLabel><FormControl><Input placeholder="e.g., New York, Los Angeles" {...field} onChange={e => field.onChange(e.target.value.split(',').map(s => s.trim()))} /></FormControl><FormMessage /></FormItem>)}
                />
                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                    <FormField control={form.control} name="agencyAffiliated" render={({ field }) => (<FormItem className="flex flex-row items-center justify-between rounded-lg border p-4"><div className="space-y-0.5"><FormLabel>Agency Affiliated?</FormLabel></div><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl></FormItem>)} />
                    <FormField control={form.control} name="availableForBooking" render={({ field }) => (<FormItem className="flex flex-row items-center justify-between rounded-lg border p-4"><div className="space-y-0.5"><FormLabel>Available for Booking?</FormLabel></div><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl></FormItem>)} />
                    <FormField control={form.control} name="travelReady" render={({ field }) => (<FormItem className="flex flex-row items-center justify-between rounded-lg border p-4"><div className="space-y-0.5"><FormLabel>Willing to Travel?</FormLabel></div><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl></FormItem>)} />
                    <FormField control={form.control} name="remoteWorkOk" render={({ field }) => (<FormItem className="flex flex-row items-center justify-between rounded-lg border p-4"><div className="space-y-0.5"><FormLabel>Open to Remote Work?</FormLabel></div><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl></FormItem>)} />
                 </div>
            </div>
           </div>

           {/* Portfolio & Social Media */}
           <div className="bg-card p-8 rounded-lg border shadow-sm">
            <h2 className="text-2xl font-bold mb-6">Portfolio & Social Media</h2>
             <div className="space-y-6">
                <FormField control={form.control} name="portfolioLinks" render={({ field }) => (<FormItem><FormLabel>Portfolio Links</FormLabel><FormControl><Textarea placeholder="Add one URL per line (e.g., YouTube, Instagram, Website)"{...field}/></FormControl><FormMessage /></FormItem>)}/>
                <FormField control={form.control} name="resumeUrl" render={({ field }) => (<FormItem><FormLabel>Resume URL</FormLabel><FormControl><Input placeholder="https://your-drive.com/resume.pdf" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField control={form.control} name="instagram" render={({ field }) => (<FormItem><FormLabel>Instagram</FormLabel><FormControl><Input placeholder="e.g. instagram.com/username" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="tiktok" render={({ field }) => (<FormItem><FormLabel>TikTok</FormLabel><FormControl><Input placeholder="e.g. tiktok.com/@username" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="youtube" render={({ field }) => (<FormItem><FormLabel>YouTube</FormLabel><FormControl><Input placeholder="e.g. youtube.com/channel/..." {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="spotify" render={({ field }) => (<FormItem><FormLabel>Spotify</FormLabel><FormControl><Input placeholder="e.g. open.spotify.com/artist/..." {...field} /></FormControl><FormMessage /></FormItem>)} />
                </div>
             </div>
           </div>

          <FormField
            control={form.control}
            name="agreeToTerms"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
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
