
import { UseFormReturn } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

interface Step2_ArtistRequirementsProps {
    form: UseFormReturn<any>;
}

const ARTIST_TYPES = ["Dancer", "Singer", "Model", "Musician", "DJ", "Actor", "Other"];

export default function Step2_ArtistRequirements({ form }: Step2_ArtistRequirementsProps) {
    return (
        <div className="space-y-4">
            <h2 className="text-lg font-medium">Artist Requirements</h2>
            
            <FormField
                control={form.control}
                name="artistType"
                render={() => (
                    <FormItem>
                        <div className="mb-4">
                            <FormLabel className="text-base">Artist Type *</FormLabel>
                            <FormDescription>
                                Select all the categories of artists you are looking for.
                            </FormDescription>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {ARTIST_TYPES.map((item) => (
                            <FormField
                                key={item}
                                control={form.control}
                                name="artistType"
                                render={({ field }) => {
                                    return (
                                    <FormItem
                                        key={item}
                                        className="flex flex-row items-start space-x-3 space-y-0"
                                    >
                                        <FormControl>
                                        <Checkbox
                                            checked={field.value?.includes(item)}
                                            onCheckedChange={(checked) => {
                                            return checked
                                                ? field.onChange([...(field.value || []), item])
                                                : field.onChange(
                                                    field.value?.filter(
                                                    (value: string) => value !== item
                                                    )
                                                )
                                            }}
                                        />
                                        </FormControl>
                                        <FormLabel className="font-normal">
                                        {item}
                                        </FormLabel>
                                    </FormItem>
                                    )
                                }}
                            />
                         ))}
                         </div>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField 
                control={form.control} 
                name="requiredSkills"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Required Skills</FormLabel>
                        <FormControl>
                            <Input 
                                placeholder="e.g., Popping, Locking, Choreography" 
                                {...field} 
                                value={Array.isArray(field.value) ? field.value.join(', ') : ''}
                                onChange={e => field.onChange(e.target.value.split(',').map(s => s.trim()))} 
                            />
                        </FormControl>
                        <FormDescription>
                            Enter a comma-separated list of skills.
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField 
                control={form.control} 
                name="requiredStyles"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Required Styles</FormLabel>
                        <FormControl>
                            <Input 
                                placeholder="e.g., Commercial, Contemporary" 
                                {...field} 
                                value={Array.isArray(field.value) ? field.value.join(', ') : ''}
                                onChange={e => field.onChange(e.target.value.split(',').map(s => s.trim()))} 
                            />
                        </FormControl>
                        <FormDescription>
                            Enter a comma-separated list of styles.
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField 
                control={form.control} 
                name="experienceLevel" 
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Experience Level *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Select required experience level" /></SelectTrigger></FormControl>
                            <SelectContent>
                                <SelectItem value="beginner">Beginner</SelectItem>
                                <SelectItem value="intermediate">Intermediate</SelectItem>
                                <SelectItem value="advanced">Advanced</SelectItem>
                                <SelectItem value="professional">Professional</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )} 
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FormField control={form.control} name="ageRange.min" render={({ field }) => (<FormItem><FormLabel>Minimum Age</FormLabel><FormControl><Input type="number" placeholder="e.g., 18" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="ageRange.max" render={({ field }) => (<FormItem><FormLabel>Maximum Age</FormLabel><FormControl><Input type="number" placeholder="e.g., 35" {...field} /></FormControl><FormMessage /></FormItem>)} />
            </div>

            <FormField 
                control={form.control} 
                name="genderPreference" 
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Gender Preference</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Select a gender preference" /></SelectTrigger></FormControl>
                            <SelectContent>
                                <SelectItem value="any">Any</SelectItem>
                                <SelectItem value="male">Male</SelectItem>
                                <SelectItem value="female">Female</SelectItem>
                                <SelectItem value="non-binary">Non-Binary</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )} 
            />

            <FormField control={form.control} name="physicalRequirements" render={({ field }) => (<FormItem><FormLabel>Physical Requirements</FormLabel><FormControl><Input placeholder="e.g., Height over 5'8'', Athletic build" {...field} /></FormControl><FormMessage /></FormItem>)} />
        </div>
    );
}
    
