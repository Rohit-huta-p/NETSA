
import { UseFormReturn } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Step3_EventRequirementsProps {
    form: UseFormReturn<any>;
}

export default function Step3_EventRequirements({ form }: Step3_EventRequirementsProps) {
    return (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold">Audience & Pricing</h2>
            <p className="text-muted-foreground">Define who your event is for and set the price.</p>

            <FormField control={form.control} name="skillLevel" render={({ field }) => (
                <FormItem>
                    <FormLabel>Skill Level *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger><SelectValue placeholder="Select a skill level" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="all_levels">All Levels</SelectItem>
                            <SelectItem value="beginner">Beginner</SelectItem>
                            <SelectItem value="intermediate">Intermediate</SelectItem>
                            <SelectItem value="advanced">Advanced</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
            )} />

            <FormField control={form.control} name="price" render={({ field }) => (
                <FormItem>
                    <FormLabel>Price ($) *</FormLabel>
                    <FormControl><Input type="number" placeholder="Enter 0 for a free event" {...field} /></FormControl>
                    <FormMessage />
                </FormItem>
            )} />

            <FormField control={form.control} name="maxParticipants" render={({ field }) => (
                <FormItem>
                    <FormLabel>Maximum Participants *</FormLabel>
                    <FormControl><Input type="number" placeholder="e.g., 25" {...field} /></FormControl>
                    <FormDescription>Set the maximum number of people who can register.</FormDescription>
                    <FormMessage />
                </FormItem>
            )} />
        </div>
    );
}
