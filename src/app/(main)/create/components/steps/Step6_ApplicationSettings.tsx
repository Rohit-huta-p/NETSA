
import { UseFormReturn } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface Step6_ApplicationSettingsProps {
    form: UseFormReturn<any>;
}

export default function Step6_ApplicationSettings({ form }: Step6_ApplicationSettingsProps) {
    return (
        <div className="space-y-4">
            <h2 className="text-lg font-medium">Application Settings</h2>
            
            <FormField 
                control={form.control} 
                name="maxApplications" 
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Maximum Applications</FormLabel>
                        <FormControl>
                            <Input type="number" placeholder="e.g., 100" {...field} />
                        </FormControl>
                        <FormDescription>
                            Leave blank for unlimited applications.
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                )} 
            />

            <FormField
                control={form.control}
                name="applicationDeadline"
                render={({ field }) => (
                    <FormItem className="flex flex-col">
                        <FormLabel>Application Deadline</FormLabel>
                        <Popover>
                            <PopoverTrigger asChild>
                            <FormControl>
                                <Button
                                variant={"outline"}
                                className={cn(
                                    "pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                )}
                                >
                                {field.value ? (
                                    format(field.value, "PPP")
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
                                date < new Date()
                                }
                                initialFocus
                            />
                            </PopoverContent>
                        </Popover>
                         <FormDescription>
                            The last day for artists to apply for this gig.
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    );
}
