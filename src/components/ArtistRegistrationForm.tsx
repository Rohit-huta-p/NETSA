
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, CalendarIcon, Palette, Check, ChevronsUpDown, X } from 'lucide-react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';
import { Input } from './ui/input';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Textarea } from './ui/textarea';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from './ui/command';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Calendar } from './ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Switch } from './ui/switch';
import { useEffect, useState, useMemo } from 'react';
import { indianCities } from '@/lib/cities';
import { Badge } from './ui/badge';

const formSchema = z
  .object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.string().email('Invalid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters long'),
    confirmPassword: z.string(),
    artistType: z.string().min(1, 'Please select an artist type'),
    otherArtistType: z.string().optional(),
    phoneNumber: z.string().optional(),
    gender: z.enum(['male', 'female', 'other']).optional(),
    dob: z.date().optional(),
    city: z.string().optional(),
    country: z.string().optional(),
    bio: z.string().optional(),
    profileImageUrl: z.string().url('Invalid URL').optional(),
    experienceYears: z.coerce.number().optional(),
    genres: z.array(z.string()).optional(),
    skills: z.array(z.string()).optional(),
    otherSkill: z.string().optional(),
    languages: z.string().optional(),
    portfolioLinks: z.string().optional(),
    resumeUrl: z.string().url('Invalid URL').optional(),
    agencyAffiliated: z.boolean().default(false),
    availableForBooking: z.boolean().default(true),
    preferredCities: z.array(z.string()).optional(),
    travelReady: z.boolean().default(false),
    remoteWorkOk: z.boolean().default(false),
    agreeToTerms: z.boolean().refine((val) => val, {
      message: 'You must agree to the terms and conditions',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })
  .refine((data) => {
    if (data.artistType === 'Other') {
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


const skillsByArtistType: Record<string, string[]> = {
    'Dancer': ['Contemporary', 'Hip-Hop', 'Ballet', 'Jazz', 'Bollywood', 'Street Dance', 'Popping', 'Locking', 'Freestyle', 'Choreography', 'Other'],
    'Singer': ['Pop', 'Rock', 'Jazz', 'Classical', 'R&B', 'Vocal Coach', 'Other'],
    'DJ': ['Turntablism', 'Live Remixing', 'Beatmatching', 'Controllerism', 'Other'],
    'Music Producer': ['Beat Making', 'Sound Design', 'Mixing', 'Mastering', 'Other'],
    'Rapper': ['Freestyle', 'Lyrical', 'Trap', 'Boom Bap', 'Other'],
    'Actor': ['Method Acting', 'Improvisation', 'Voice Acting', 'Stage Combat', 'Other'],
    'Model': ['Fashion', 'Runway', 'Commercial', 'Fitness', 'Other'],
    'Choreographer': ['Contemporary', 'Hip-Hop', 'Ballet', 'Jazz', 'Musical Theatre', 'Other'],
    'Voice-over Artist': ['Character Voices', 'Narration', 'Commercials', 'Animation', 'Other'],
    'Instrumentalist': ['Guitar', 'Piano', 'Drums', 'Violin', 'Saxophone', 'Other'],
    'Theatre Artist': ['Stage Management', 'Set Design', 'Lighting Design', 'Sound Design', 'Other'],
    'Host / Emcee / Presenter': ['Corporate Events', 'Weddings', 'Live Shows', 'Public Speaking', 'Other'],
  };

const artistTypes = [
  'Dancer',
  'Singer',
  'DJ',
  'Music Producer',
  'Rapper',
  'Actor',
  'Model',
  'Choreographer',
  'Voice-over Artist',
  'Instrumentalist',
  'Theatre Artist',
  'Host / Emcee / Presenter',
  'Other'
];

const genres = ['hip hop', 'freestyle', 'classical', 'folk', 'pop', 'rock'];

export default function ArtistRegistrationForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      artistType: '',
      otherArtistType: '',
      phoneNumber: '',
      bio: '',
      skills: [],
      otherSkill: '',
      agreeToTerms: false,
      agencyAffiliated: false,
      availableForBooking: true,
      travelReady: false,
      remoteWorkOk: false,
      genres: [],
      preferredCities: [],
    },
  });

  const watchedArtistType = form.watch('artistType');
  const watchedSkills = form.watch('skills');

  useEffect(() => {
    form.resetField('skills');
  }, [watchedArtistType, form]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
  };

  const currentSkills = skillsByArtistType[watchedArtistType] || [];
  const [artistTypePopoverOpen, setArtistTypePopoverOpen] = useState(false);
  const [citiesPopoverOpen, setCitiesPopoverOpen] = useState(false);

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
          {/* Personal Information */}
          <div className="bg-card p-8 rounded-lg border shadow-sm">
            <h2 className="text-2xl font-bold mb-6">Personal Information</h2>
            <div className="space-y-6">
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
                              className={cn(
                                'w-full pl-3 text-left font-normal',
                                !field.value && 'text-muted-foreground'
                              )}
                            >
                              {field.value ? (
                                format(field.value, 'PPP')
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date('1900-01-01')
                            }
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
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex space-x-4"
                        >
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="male" />
                            </FormControl>
                            <FormLabel className="font-normal">Male</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="female" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Female
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="other" />
                            </FormControl>
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
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          {/* Account Information */}
          <div className="bg-card p-8 rounded-lg border shadow-sm">
            <h2 className="text-2xl font-bold mb-6">Account Information</h2>
            <div className="space-y-6">
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
            </div>
          </div>

          {/* Artist Profile */}
          <div className="bg-card p-8 rounded-lg border shadow-sm">
            <h2 className="text-2xl font-bold mb-6">Your Artist Profile</h2>
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="artistType"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Artist Type *</FormLabel>
                    <Popover open={artistTypePopoverOpen} onOpenChange={setArtistTypePopoverOpen}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={artistTypePopoverOpen}
                            className={cn(
                              'w-full justify-between',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value
                              ? artistTypes.find(
                                  (type) => type === field.value
                                )
                              : 'Select your primary artistic discipline'}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                        <Command>
                          <CommandInput placeholder="Search artist type..." />
                          <CommandList>
                            <CommandEmpty>No artist type found.</CommandEmpty>
                            <CommandGroup>
                              {artistTypes.map((type) => (
                                <CommandItem
                                  value={type}
                                  key={type}
                                  onSelect={() => {
                                    form.setValue('artistType', type);
                                    setArtistTypePopoverOpen(false);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      'mr-2 h-4 w-4',
                                      type === field.value
                                        ? 'opacity-100'
                                        : 'opacity-0'
                                    )}
                                  />
                                  {type}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {watchedArtistType === 'Other' && (
                <FormField
                  control={form.control}
                  name="otherArtistType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Please specify</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g., Stunt Performer" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell us about yourself, your passion for the arts, and what makes you unique..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {currentSkills.length > 0 && (
                <FormField
                  control={form.control}
                  name="skills"
                  render={() => (
                    <FormItem>
                      <FormLabel>Skills & Specialties</FormLabel>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {currentSkills.map((item) => (
                          <FormField
                            key={item}
                            control={form.control}
                            name="skills"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={item}
                                  className="flex flex-row items-start space-x-2 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(item)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([
                                              ...(field.value || []),
                                              item,
                                            ])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== item
                                              )
                                            );
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    {item}
                                  </FormLabel>
                                </FormItem>
                              );
                            }}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              {watchedSkills?.includes('Other') && (
                <FormField
                  control={form.control}
                  name="otherSkill"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Please specify skill</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g., Juggling" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <FormField
                control={form.control}
                name="genres"
                render={() => (
                  <FormItem>
                    <FormLabel>Genres</FormLabel>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {genres.map((item) => (
                        <FormField
                          key={item}
                          control={form.control}
                          name="genres"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={item}
                                className="flex flex-row items-start space-x-2 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(item)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([
                                            ...(field.value || []),
                                            item,
                                          ])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== item
                                            )
                                          );
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal capitalize">
                                  {item}
                                </FormLabel>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="experienceYears"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Years of Experience</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 5" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="languages"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Languages</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., English, Hindi"
                          {...field}
                        />
                      </FormControl>
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
                    <FormControl>
                      <Input
                        placeholder="https://your-domain.com/profile-photo.jpg"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="portfolioLinks"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Portfolio Links</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Add one URL per line (e.g., YouTube, Instagram, Website)"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="resumeUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Resume URL</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://your-drive.com/resume.pdf"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Availability & Preferences */}
          <div className="bg-card p-8 rounded-lg border shadow-sm">
            <h2 className="text-2xl font-bold mb-6">
              Availability & Preferences
            </h2>
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="availableForBooking"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel>Available for Booking?</FormLabel>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="travelReady"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel>Willing to Travel?</FormLabel>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="remoteWorkOk"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel>Open to Remote Work?</FormLabel>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="agencyAffiliated"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel>Affiliated with an Agency?</FormLabel>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="preferredCities"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Preferred Work Cities</FormLabel>
                     <Popover open={citiesPopoverOpen} onOpenChange={setCitiesPopoverOpen}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "w-full justify-between",
                              !field.value?.length && "text-muted-foreground"
                            )}
                          >
                            <div className="flex gap-1 flex-wrap">
                              {field.value && field.value.length > 0 ? (
                                field.value.map((city) => (
                                  <Badge
                                    variant="secondary"
                                    key={city}
                                    className="mr-1"
                                    onClick={() => {
                                        const newValue = field.value?.filter(v => v !== city) || [];
                                        field.onChange(newValue);
                                    }}
                                  >
                                    {city}
                                    <X className="w-3 h-3 ml-1" />
                                  </Badge>
                                ))
                              ) : (
                                <span>Select cities</span>
                              )}
                             </div>
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                        <Command>
                          <CommandInput placeholder="Search cities..." />
                          <CommandList>
                            <CommandEmpty>No city found.</CommandEmpty>
                            <CommandGroup>
                              {indianCities.map((city) => (
                                <CommandItem
                                  value={city}
                                  key={city}
                                  onSelect={() => {
                                    const currentValue = field.value || [];
                                    const isSelected = currentValue.includes(city);
                                    if (isSelected) {
                                      field.onChange(currentValue.filter(c => c !== city));
                                    } else {
                                      field.onChange([...currentValue, city]);
                                    }
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      field.value?.includes(city)
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  {city}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                     <FormDescription>
                       You can select multiple cities.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
          >
            Create Artist Account
          </Button>
        </form>
      </Form>
    </div>
  );
}
