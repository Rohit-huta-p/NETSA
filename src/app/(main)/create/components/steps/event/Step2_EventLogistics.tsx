
import { UseFormReturn } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface Step2_EventLogisticsProps {
    form: UseFormReturn<any>;
}

export default function Step2_EventLogistics({ form }: Step2_EventLogisticsProps) {
    const locationType = form.watch('locationType');

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold">Logistics & Location</h2>
            <p className="text-muted-foreground">Where and when is your event taking place?</p>

            <FormField control={form.control} name="locationType" render={({ field }) => (
                <FormItem>
                    <FormLabel>Location Type *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger><SelectValue placeholder="Select location type" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="in_person">In-Person</SelectItem>
                            <SelectItem value="online">Online</SelectItem>
                            <SelectItem value="hybrid">Hybrid</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
            )} />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField control={form.control} name="city" render={({ field }) => (<FormItem><FormLabel>City *</FormLabel><FormControl><Input placeholder="e.g., New York" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="country" render={({ field }) => (<FormItem><FormLabel>Country *</FormLabel><FormControl><Input placeholder="e.g., USA" {...field} /></FormControl><FormMessage /></FormItem>)} />
            </div>

            <FormField control={form.control} name="venue" render={({ field }) => (
                <FormItem>
                    <FormLabel>{locationType === 'online' ? 'Platform' : 'Venue'}</FormLabel>
                    <FormControl><Input placeholder={locationType === 'online' ? 'e.g., Zoom, Google Meet' : 'e.g., Broadway Dance Center'} {...field} /></FormControl>
                    <FormMessage />
                </FormItem>
            )} />

            <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                    <FormItem className="flex flex-col">
                    <FormLabel>Start Date *</FormLabel>
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
                            date < new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                        />
                        </PopoverContent>
                    </Popover>
                    <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    );
}
