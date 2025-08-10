
import { UseFormReturn } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Step1_EventDetailsProps {
    form: UseFormReturn<any>;
}

export default function Step1_EventDetails({ form }: Step1_EventDetailsProps) {
    return (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold">Event Details</h2>
            <p className="text-muted-foreground">Start with the basics. What is your event about?</p>
            
            <FormField control={form.control} name="title" render={({ field }) => (<FormItem><FormLabel>Event Title *</FormLabel><FormControl><Input placeholder="e.g., Urban Dance Masterclass" {...field} /></FormControl><FormMessage /></FormItem>)} />
            
            <FormField control={form.control} name="description" render={({ field }) => (<FormItem><FormLabel>Description *</FormLabel><FormControl><Textarea rows={5} placeholder="Describe the event, what attendees will learn, and any prerequisites." {...field} /></FormControl><FormMessage /></FormItem>)} />
            
            <FormField control={form.control} name="category" render={({ field }) => (
                <FormItem>
                    <FormLabel>Event Category *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="performance">Performance</SelectItem>
                            <SelectItem value="competition">Competition</SelectItem>
                            <SelectItem value="masterclass">Masterclass</SelectItem>
                            <SelectItem value="audition">Audition</SelectItem>
                            <SelectItem value="showcase">Showcase</SelectItem>
                            <SelectItem value="networking">Networking</SelectItem>
                            <SelectItem value="festival">Festival</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
            )} />
        </div>
    );
}
