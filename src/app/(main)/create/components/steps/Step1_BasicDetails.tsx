
import { UseFormReturn } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Step1_BasicDetailsProps {
    form: UseFormReturn<any>;
}

export default function Step1_BasicDetails({ form }: Step1_BasicDetailsProps) {
    return (
        <div className="space-y-4">
            <h2 className="text-lg font-medium">Basic Gig Details</h2>
            <FormField control={form.control} name="title" render={({ field }) => (<FormItem><FormLabel>Gig Title</FormLabel><FormControl><Input placeholder="e.g., Lead Dancer for Music Video" {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="description" render={({ field }) => (<FormItem><FormLabel>Description</FormLabel><FormControl><Textarea placeholder="Describe the gig, responsibilities, and what you're looking for." {...field} /></FormControl><FormMessage /></FormItem>)} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FormField control={form.control} name="type" render={({ field }) => (<FormItem><FormLabel>Gig Type</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a type" /></SelectTrigger></FormControl><SelectContent><SelectItem value="performance">Performance</SelectItem><SelectItem value="photoshoot">Photoshoot</SelectItem><SelectItem value="recording">Recording</SelectItem><SelectItem value="event">Event Staff</SelectItem><SelectItem value="audition">Audition</SelectItem><SelectItem value="modeling">Modeling</SelectItem><SelectItem value="teaching">Teaching</SelectItem><SelectItem value="collaboration">Collaboration</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="category" render={({ field }) => (<FormItem><FormLabel>Category</FormLabel><FormControl><Input placeholder="e.g., Hip-Hop, Commercial" {...field} /></FormControl><FormMessage /></FormItem>)} />
            </div>
        </div>
    );
}

    