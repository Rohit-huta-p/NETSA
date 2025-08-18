
import { UseFormReturn, useFormContext } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface Step4_ApplicationsAndReviewProps {
    form: UseFormReturn<any>;
}


export default function Step4_ApplicationsAndReview({ form }: Step4_ApplicationsAndReviewProps) {
    const { getValues } = useFormContext();
    const values = getValues();

    const renderArray = (arr: any) => {
        if (Array.isArray(arr) && arr.length > 0 && arr[0] !== '' && arr[0] !== undefined) {
            return arr.join(', ');
        }
        return 'Not specified';
    }

    const renderMediaRequirements = (reqs: any) => {
        if (!reqs) return 'Not specified';
        const needed = Object.entries(reqs)
            .filter(([key, value]) => key.startsWith('needs') && value === true)
            .map(([key]) => key.replace('needs', ''));
        if (needed.length === 0) return 'None';
        return needed.join(', ');
    }

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-lg font-medium">Application Settings</h2>
                <p className="text-sm text-muted-foreground">Configure how artists can apply to your gig.</p>
            </div>
            
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

            <Separator />
            
            <div>
                <h2 className="text-2xl font-bold mb-2 font-headline">Review Your Gig</h2>
                <p className="text-muted-foreground">You're ready to post! Review the details below. You can save it as a draft to edit later, or publish it now to start receiving applications.</p>
            </div>
            
            <Card className="border-primary">
                <CardHeader>
                    <CardTitle className="text-primary font-headline">{values.title || 'Untitled Gig'}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <h3 className="font-semibold text-lg mb-2">Basic Details</h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div><p className="text-muted-foreground">Type</p><p className="font-medium capitalize">{values.type || 'N/A'}</p></div>
                            <div><p className="text-muted-foreground">Category</p><p className="font-medium">{values.category || 'N/A'}</p></div>
                        </div>
                        <div className="mt-4">
                             <p className="text-muted-foreground text-sm">Description</p>
                             <p className="text-sm font-medium mt-1">{values.description || 'No description provided.'}</p>
                        </div>
                    </div>

                    <Separator />

                    <div>
                        <h3 className="font-semibold text-lg mb-2">Artist Requirements</h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-muted-foreground">Artist Types</p>
                                <div className="flex flex-wrap gap-1 mt-1">
                                    {(values.artistType && values.artistType.length > 0) ? values.artistType.map((type: string) => <Badge key={type} variant="secondary">{type}</Badge>) : <p className="font-medium">Any</p>}
                                </div>
                            </div>
                            <div><p className="text-muted-foreground">Experience</p><p className="font-medium capitalize">{values.experienceLevel?.replace('_', ' ') || 'N/A'}</p></div>
                            <div><p className="text-muted-foreground">Skills</p><p className="font-medium">{renderArray(values.requiredSkills)}</p></div>
                            <div><p className="text-muted-foreground">Styles</p><p className="font-medium">{renderArray(values.requiredStyles)}</p></div>
                            <div><p className="text-muted-foreground">Age Range</p><p className="font-medium">{values.ageRange?.min || 'Any'} - {values.ageRange?.max || 'Any'}</p></div>
                            <div><p className="text-muted-foreground">Gender</p><p className="font-medium capitalize">{values.genderPreference || 'Any'}</p></div>
                        </div>
                         <div className="mt-4">
                             <p className="text-muted-foreground text-sm">Physical Requirements</p>
                             <p className="text-sm font-medium mt-1">{values.physicalRequirements || 'None specified.'}</p>
                        </div>
                    </div>

                     <Separator />
                     
                    <div>
                        <h3 className="font-semibold text-lg mb-2">Location & Schedule</h3>
                         <div className="grid grid-cols-2 gap-4 text-sm">
                            <div><p className="text-muted-foreground">Location</p><p className="font-medium">{values.location?.isRemote ? 'Remote' : `${values.location?.city}, ${values.location?.country}`}</p></div>
                            <div><p className="text-muted-foreground">Venue</p><p className="font-medium">{values.location?.venue || 'Not specified'}</p></div>
                            <div><p className="text-muted-foreground">Start Date</p><p className="font-medium">{values.startDate ? new Date(values.startDate).toLocaleDateString() : 'TBD'}</p></div>
                            <div><p className="text-muted-foreground">End Date</p><p className="font-medium">{values.endDate ? new Date(values.endDate).toLocaleDateString() : 'Not specified'}</p></div>
                             <div><p className="text-muted-foreground">Time Commitment</p><p className="font-medium">{values.timeCommitment || 'Not specified'}</p></div>
                        </div>
                    </div>

                    <Separator />

                     <div>
                        <h3 className="font-semibold text-lg mb-2">Compensation</h3>
                         <div className="grid grid-cols-2 gap-4 text-sm">
                            <div><p className="text-muted-foreground">Type</p><p className="font-medium capitalize">{values.compensation?.type?.replace('_', ' ') || 'N/A'}</p></div>
                             <div><p className="text-muted-foreground">Amount</p><p className="font-medium">{values.compensation?.amount ? `${values.compensation.amount} ${values.compensation.currency || 'USD'}` : 'Not specified'}</p></div>
                             <div><p className="text-muted-foreground">Negotiable</p><p className="font-medium">{values.compensation?.negotiable ? 'Yes' : 'No'}</p></div>
                             <div><p className="text-muted-foreground">Benefits</p><p className="font-medium">{renderArray(values.compensation?.additionalBenefits)}</p></div>
                        </div>
                    </div>

                     <Separator />

                     <div>
                        <h3 className="font-semibold text-lg mb-2">Application & Media</h3>
                         <div className="grid grid-cols-2 gap-4 text-sm">
                            <div><p className="text-muted-foreground">Deadline</p><p className="font-medium">{values.applicationDeadline ? new Date(values.applicationDeadline).toLocaleDateString() : 'Not specified'}</p></div>
                             <div><p className="text-muted-foreground">Max Applicants</p><p className="font-medium">{values.maxApplications || 'Unlimited'}</p></div>
                             <div>
                                <p className="text-muted-foreground">Media Required</p>
                                <p className="font-medium">{renderMediaRequirements(values.mediaRequirements)}</p>
                             </div>
                        </div>
                        <div className="mt-4">
                            <p className="text-muted-foreground text-sm">Specific Media Instructions</p>
                            <p className="text-sm font-medium mt-1">{values.mediaRequirements?.specificRequirements || 'None specified.'}</p>
                        </div>
                    </div>

                </CardContent>
            </Card>
        </div>
    );
}

    