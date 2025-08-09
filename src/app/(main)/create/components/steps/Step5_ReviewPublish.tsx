
import { useFormContext } from "react-hook-form";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function Step5_ReviewPublish() {
    const { getValues } = useFormContext();
    const values = getValues();

    const renderArray = (arr: string[] | undefined) => arr && arr.length > 0 ? arr.join(', ') : 'Not specified';

    return (
        <div className="space-y-8">
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
                </CardContent>
            </Card>
        </div>
    );
}
