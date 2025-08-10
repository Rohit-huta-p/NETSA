
import { useFormContext } from "react-hook-form";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";

export default function Step4_ReviewEvent() {
    const { getValues } = useFormContext();
    const values = getValues();

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold font-headline">Review Your Event</h2>
                <p className="text-muted-foreground">You're ready to post! Review the details below. You can save it as a draft or publish it now.</p>
            </div>
            
            <Card className="border-primary">
                <CardHeader>
                    <CardTitle className="text-primary font-headline">{values.title || 'Untitled Event'}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <h3 className="font-semibold text-lg mb-2">Basic Details</h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div><p className="text-muted-foreground">Category</p><p className="font-medium capitalize">{values.category || 'N/A'}</p></div>
                        </div>
                        <div className="mt-4">
                             <p className="text-muted-foreground text-sm">Description</p>
                             <p className="text-sm font-medium mt-1">{values.description || 'No description provided.'}</p>
                        </div>
                    </div>

                    <Separator />

                    <div>
                        <h3 className="font-semibold text-lg mb-2">Logistics & Requirements</h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div><p className="text-muted-foreground">Date</p><p className="font-medium">{values.startDate ? format(new Date(values.startDate), "PPP") : 'TBD'}</p></div>
                             <div><p className="text-muted-foreground">Location</p><p className="font-medium capitalize">{values.locationType?.replace('_', ' ')}</p></div>
                             <div><p className="text-muted-foreground">Venue/Platform</p><p className="font-medium">{values.venue || 'Not specified'}</p></div>
                            <div><p className="text-muted-foreground">Address</p><p className="font-medium">{values.city}, {values.country}</p></div>
                            <div><p className="text-muted-foreground">Skill Level</p><p className="font-medium capitalize">{values.skillLevel?.replace('_', ' ') || 'N/A'}</p></div>
                             <div><p className="text-muted-foreground">Price</p><p className="font-medium">${values.price ?? 'Free'}</p></div>
                            <div><p className="text-muted-foreground">Max Participants</p><p className="font-medium">{values.maxParticipants || 'Unlimited'}</p></div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
