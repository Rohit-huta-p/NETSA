
import { UseFormReturn } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Step2_ArtistDetailsProps {
    form: UseFormReturn<any>;
}

const artistTypes = ['dancer', 'singer', 'model', 'musician', 'dj', 'actor', 'other'];

const renderMultiSelect = (field: any, placeholder: string, description: string) => (
    <Input 
        placeholder={placeholder}
        {...field} 
        value={Array.isArray(field.value) ? field.value.join(', ') : ''}
        onChange={e => field.onChange(e.target.value.split(',').map(s => s.trim()).filter(Boolean))} 
    />
);

export function Step2_ArtistDetails({ form }: Step2_ArtistDetailsProps) {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                    control={form.control}
                    name="artistType"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Primary Discipline</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select your primary discipline" />
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
                 <FormField control={form.control} name="experienceYears" render={({ field }) => (<FormItem><FormLabel>Years of Experience</FormLabel><FormControl><Input type="number" placeholder="e.g., 5" {...field} /></FormControl><FormMessage /></FormItem>)} />
            </div>
            
            <FormField 
                control={form.control} 
                name="skills"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Skills</FormLabel>
                        <FormControl>{renderMultiSelect(field, "e.g., Popping, Locking, Choreography", "Enter a comma-separated list of your skills.")}</FormControl>
                        <FormDescription>Enter a comma-separated list of your skills.</FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            />
             <FormField 
                control={form.control} 
                name="styles"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Styles</FormLabel>
                        <FormControl>{renderMultiSelect(field, "e.g., Commercial, Contemporary, Hip-Hop", "Enter a comma-separated list of your styles.")}</FormControl>
                        <FormDescription>Enter a comma-separated list of your styles.</FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            />
             <FormField 
                control={form.control} 
                name="genres"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Genres</FormLabel>
                        <FormControl>{renderMultiSelect(field, "e.g., Pop, R&B, Electronic", "Enter a comma-separated list of your genres.")}</FormControl>
                        <FormDescription>Enter a comma-separated list of your genres.</FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    );
}
