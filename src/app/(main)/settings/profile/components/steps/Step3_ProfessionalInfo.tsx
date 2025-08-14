
import { UseFormReturn } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Instagram, Music, Scissors, Youtube } from 'lucide-react';

interface Step3_ProfessionalInfoProps {
    form: UseFormReturn<any>;
}

export function Step3_ProfessionalInfo({ form }: Step3_ProfessionalInfoProps) {
    return (
        <div className="space-y-6">
            <h3 className="text-lg font-medium">Availability & Rate</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField control={form.control} name="hourlyRate" render={({ field }) => (<FormItem><FormLabel>Hourly Rate ($)</FormLabel><FormControl><Input type="number" placeholder="e.g., 50" {...field} /></FormControl><FormDescription>Leave blank if negotiable or not applicable.</FormDescription><FormMessage /></FormItem>)} />
            </div>
            <div className="flex flex-wrap gap-x-8 gap-y-4">
                 <FormField control={form.control} name="availableForBooking" render={({ field }) => (<FormItem className="flex flex-row items-center space-x-3 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel className="font-normal">Available for Booking</FormLabel></FormItem>)} />
                 <FormField control={form.control} name="agencyAffiliated" render={({ field }) => (<FormItem className="flex flex-row items-center space-x-3 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel className="font-normal">Affiliated with an Agency</FormLabel></FormItem>)} />
                 <FormField control={form.control} name="travelReady" render={({ field }) => (<FormItem className="flex flex-row items-center space-x-3 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel className="font-normal">Willing to Travel</FormLabel></FormItem>)} />
            </div>

            <h3 className="text-lg font-medium pt-4 border-t">Social Media</h3>
            <div className="space-y-4">
                 <FormField control={form.control} name="socialMedia.instagram" render={({ field }) => (<FormItem><FormLabel>Instagram</FormLabel><div className="relative"><Instagram className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><FormControl><Input placeholder="your_handle" {...field} className="pl-9" /></FormControl></div><FormMessage /></FormItem>)} />
                 <FormField control={form.control} name="socialMedia.tiktok" render={({ field }) => (<FormItem><FormLabel>TikTok</FormLabel><div className="relative"><Scissors className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><FormControl><Input placeholder="@your_handle" {...field} className="pl-9" /></FormControl></div><FormMessage /></FormItem>)} />
                 <FormField control={form.control} name="socialMedia.youtube" render={({ field }) => (<FormItem><FormLabel>YouTube</FormLabel><div className="relative"><Youtube className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><FormControl><Input placeholder="your_channel_url" {...field} className="pl-9" /></FormControl></div><FormMessage /></FormItem>)} />
                 <FormField control={form.control} name="socialMedia.spotify" render={({ field }) => (<FormItem><FormLabel>Spotify</FormLabel><div className="relative"><Music className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><FormControl><Input placeholder="your_artist_url" {...field} className="pl-9" /></FormControl></div><FormMessage /></FormItem>)} />
            </div>

        </div>
    );
}
