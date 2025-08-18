
import { UseFormReturn } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';

interface Step1_BasicDetailsProps {
    form: UseFormReturn<any>;
}

const mediaOptions = [
    { id: 'needsHeadshots', label: 'Headshots' },
    { id: 'needsFullBody', label: 'Full-Body Photos' },
    { id: 'needsVideoReel', label: 'Video Reel' },
    { id: 'needsAudioSample', label: 'Audio Sample' },
]

export default function Step1_BasicDetails({ form }: Step1_BasicDetailsProps) {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-lg font-medium">Basic Gig Details</h2>
                <p className="text-sm text-muted-foreground">Start with the essentials for your gig posting.</p>
            </div>
            <FormField control={form.control} name="title" render={({ field }) => (<FormItem><FormLabel>Gig Title *</FormLabel><FormControl><Input placeholder="e.g., Lead Dancer for Music Video" {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="description" render={({ field }) => (<FormItem><FormLabel>Description *</FormLabel><FormControl><Textarea placeholder="Describe the gig, responsibilities, and what you're looking for." {...field} rows={4} /></FormControl><FormMessage /></FormItem>)} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField control={form.control} name="type" render={({ field }) => (<FormItem><FormLabel>Gig Type *</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a type" /></SelectTrigger></FormControl><SelectContent><SelectItem value="performance">Performance</SelectItem><SelectItem value="photoshoot">Photoshoot</SelectItem><SelectItem value="recording">Recording</SelectItem><SelectItem value="event">Event Staff</SelectItem><SelectItem value="audition">Audition</SelectItem><SelectItem value="modeling">Modeling</SelectItem><SelectItem value="teaching">Teaching</SelectItem><SelectItem value="collaboration">Collaboration</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="category" render={({ field }) => (<FormItem><FormLabel>Category *</FormLabel><FormControl><Input placeholder="e.g., Hip-Hop, Commercial" {...field} /></FormControl><FormMessage /></FormItem>)} />
            </div>
            
            <Separator />

            <div>
                <h2 className="text-lg font-medium">Media Requirements</h2>
                <p className="text-sm text-muted-foreground">Specify what media applicants should submit.</p>
            </div>
            
             <FormItem>
                <div className="grid grid-cols-2 gap-4">
                    {mediaOptions.map((item) => (
                        <FormField
                            key={item.id}
                            control={form.control}
                            name={`mediaRequirements.${item.id}`}
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                        {item.label}
                                    </FormLabel>
                                </FormItem>
                            )}
                        />
                    ))}
                </div>
            </FormItem>

            <FormField 
                control={form.control} 
                name="mediaRequirements.specificRequirements" 
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Specific Instructions</FormLabel>
                        <FormControl>
                            <Textarea 
                                placeholder="e.g., 'Please include a 1-minute unedited dance video.' or 'Headshots must be from the last 6 months.'" 
                                {...field} 
                                rows={3}
                            />
                        </FormControl>
                        <FormDescription>
                            Provide any specific details or instructions for the required media.
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                )} 
            />
        </div>
    );
}
