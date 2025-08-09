
import { UseFormReturn } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

interface Step4_CompensationProps {
    form: UseFormReturn<any>;
}

export default function Step4_Compensation({ form }: Step4_CompensationProps) {
    return (
        <div className="space-y-4">
            <h2 className="text-lg font-medium">Compensation</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FormField control={form.control} name="compensation.type" render={({ field }) => (<FormItem><FormLabel>Compensation Type *</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select payment model" /></SelectTrigger></FormControl><SelectContent><SelectItem value="hourly">Hourly</SelectItem><SelectItem value="daily">Daily</SelectItem><SelectItem value="project">Project-based</SelectItem><SelectItem value="revenue_share">Revenue Share</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="compensation.amount" render={({ field }) => (<FormItem><FormLabel>Amount</FormLabel><FormControl><Input type="number" placeholder="e.g., 500" {...field} /></FormControl><FormMessage /></FormItem>)} />
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
                            <Input placeholder="e.g., Travel, Accommodation" {...field} onChange={e => field.onChange(e.target.value.split(',').map(s => s.trim()))} />
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
    