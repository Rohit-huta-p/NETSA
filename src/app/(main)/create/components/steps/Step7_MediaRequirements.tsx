
import { UseFormReturn } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormDescription } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';

interface Step7_MediaRequirementsProps {
    form: UseFormReturn<any>;
}

const mediaTypes = [
  { id: 'needsHeadshots', label: 'Headshots' },
  { id: 'needsFullBody', label: 'Full-Body Photos' },
  { id: 'needsVideoReel', label: 'Video Reel' },
  { id: 'needsAudioSample', label: 'Audio Sample' },
] as const;


export default function Step7_MediaRequirements({ form }: Step7_MediaRequirementsProps) {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-lg font-medium">Media Requirements</h2>
                <p className="text-sm text-muted-foreground">Specify what media applicants should submit.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mediaTypes.map((item) => (
                    <FormField
                        key={item.id}
                        control={form.control}
                        name={`mediaRequirements.${item.id}`}
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                                <FormControl>
                                    <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                    <FormLabel>
                                        {item.label}
                                    </FormLabel>
                                </div>
                            </FormItem>
                        )}
                    />
                 ))}
            </div>

            <FormField 
                control={form.control} 
                name="mediaRequirements.specificRequirements"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Specific Requirements</FormLabel>
                        <FormControl>
                            <Textarea placeholder="e.g., 'Video reel should be no longer than 2 minutes and focus on contemporary dance.'" {...field} />
                        </FormControl>
                        <FormDescription>
                           Provide any additional instructions for media submissions.
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    );
}
