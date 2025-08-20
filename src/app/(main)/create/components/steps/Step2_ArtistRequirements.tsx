
import { UseFormReturn } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';

interface Step2_ArtistRequirementsProps {
    form: UseFormReturn<any>;
}

const ARTIST_TYPES = ["Dancer", "Singer", "Model", "Musician", "DJ", "Actor", "Other"];

const renderMultiSelect = (field: any, placeholder: string) => (
    <Input 
        placeholder={placeholder}
        {...field} 
        value={Array.isArray(field.value) ? field.value.join(', ') : ''}
        onChange={e => field.onChange(e.target.value.split(',').map(s => s.trim()).filter(Boolean))} 
    />
);

export default function Step2_ArtistRequirements({ form }: Step2_ArtistRequirementsProps) {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-lg font-medium">Artist Requirements</h2>
                <p className="text-sm text-muted-foreground">Specify the type of artist you're looking for.</p>
            </div>
            
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

            <FormField control={form.control} name="requiredSkills" render={({ field }) => (<FormItem><FormLabel>Required Skills</FormLabel><FormControl>{renderMultiSelect(field, "e.g., Popping, Locking, Improvisation")}</FormControl><FormDescription>Enter a comma-separated list of required skills.</FormDescription><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="requiredStyles" render={({ field }) => (<FormItem><FormLabel>Required Styles</FormLabel><FormControl>{renderMultiSelect(field, "e.g., Commercial Hip-Hop, Ballet")}</FormControl><FormDescription>Enter a comma-separated list of required styles.</FormDescription><FormMessage /></FormItem>)} />

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

            <FormField control={form.control} name="genderPreference" render={({ field }) => (
                <FormItem>
                    <FormLabel>Gender Preference</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select gender preference" /></SelectTrigger></FormControl>
                        <SelectContent>
                            <SelectItem value="any">Any</SelectItem>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="non-binary">Non-Binary</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
            )} />

             <FormField control={form.control} name="physicalRequirements" render={({ field }) => (
                <FormItem>
                    <FormLabel>Physical Requirements</FormLabel>
                    <FormControl><Textarea placeholder="e.g., Height 5'8\"  {...field} /></FormControl>
                    <FormDescription>Specify any physical requirements for the role.</FormDescription>
                    <FormMessage />
                </FormItem>
            )} />

            <Separator />
            <div>
                 <h2 className="text-lg font-medium">Compensation</h2>
                <p className="text-sm text-muted-foreground">Let artists know how they will be compensated.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FormField control={form.control} name="compensation.type" render={({ field }) => (<FormItem><FormLabel>Compensation Type *</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select payment model" /></SelectTrigger></FormControl><SelectContent><SelectItem value="hourly">Hourly</SelectItem><SelectItem value="daily">Daily</SelectItem><SelectItem value="project">Project-based</SelectItem><SelectItem value="revenue_share">Revenue Share</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="compensation.amount" render={({ field }) => (<FormItem><FormLabel>Amount</FormLabel><FormControl><Input type="number" placeholder="e.g., 500" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FormField control={form.control} name="compensation.currency" render={({ field }) => (<FormItem><FormLabel>Currency</FormLabel><FormControl><Input placeholder="e.g., USD, EUR" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField
                    control={form.control}
                    name="compensation.negotiable"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 mt-8">
                            <div className="space-y-0.5">
                                <FormLabel className="text-base">Negotiable</FormLabel>
                                <FormDescription>
                                    Is the compensation negotiable?
                                </FormDescription>
                            </div>
                            <FormControl>
                                <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
            </div>
             <FormField 
                control={form.control} 
                name="compensation.additionalBenefits"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Additional Benefits</FormLabel>
                        <FormControl>
                            {renderMultiSelect(field, "e.g., Travel, Accommodation")}
                        </FormControl>
                        <FormDescription>
                            Enter a comma-separated list of benefits.
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    );
}
