
import type { Gig } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, DollarSign, Briefcase, Star, Clock, Target } from "lucide-react";
import { format } from "date-fns";

interface GigDetailViewProps {
    gig: Gig;
}

const renderArray = (arr: any) => {
    if (Array.isArray(arr) && arr.length > 0 && arr.filter(item => item).length > 0) {
        return arr.map(item => <Badge key={item} variant="secondary">{item}</Badge>);
    }
    return <span className="text-sm text-muted-foreground">Not specified</span>;
}

export function GigDetailView({ gig }: GigDetailViewProps) {
    
    return (
        <Card className="rounded-2xl shadow-lg border-2">
            <CardHeader className="p-6">
                <div className="flex justify-between items-start">
                    <div>
                        <Badge className="bg-purple-100 text-purple-700 capitalize mb-2">{gig.type}</Badge>
                        <CardTitle className="text-3xl font-bold font-headline">{gig.title}</CardTitle>
                    </div>
                    <Button className="bg-gradient-to-r from-purple-500 to-orange-500 text-white font-bold">Apply Now</Button>
                </div>
                <div className="flex items-center gap-4 pt-4">
                    <Avatar className="w-12 h-12 border">
                        <AvatarImage src={gig.organizerInfo.profileImageUrl} />
                        <AvatarFallback>{gig.organizerInfo.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-semibold">{gig.organizerInfo.name}</p>
                        <p className="text-sm text-muted-foreground">{gig.organizerInfo.organization}</p>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
                <div>
                    <h4 className="font-semibold mb-2">Description</h4>
                    <p className="text-muted-foreground">{gig.description}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
                    <div>
                        <h4 className="font-semibold mb-3 text-lg">Key Details</h4>
                        <div className="space-y-3 text-muted-foreground">
                            <div className="flex items-center gap-3"><Calendar className="w-5 h-5 text-primary" /><span>{format(new Date(gig.startDate), 'PPP')}</span></div>
                            <div className="flex items-center gap-3"><MapPin className="w-5 h-5 text-primary" /><span>{gig.location.city}, {gig.location.country}</span></div>
                            <div className="flex items-center gap-3"><DollarSign className="w-5 h-5 text-primary" /><span className="capitalize">{gig.compensation.amount ? `${gig.compensation.amount} ${gig.compensation.currency}` : 'N/A'} ({gig.compensation.type.replace('_', ' ')})</span></div>
                            <div className="flex items-center gap-3"><Briefcase className="w-5 h-5 text-primary" /><span className="capitalize">{gig.experienceLevel} Level</span></div>
                            <div className="flex items-center gap-3"><Clock className="w-5 h-5 text-primary" /><span>Deadline: {gig.applicationDeadline ? format(new Date(gig.applicationDeadline), 'PPP') : 'Not specified'}</span></div>
                        </div>
                    </div>
                     <div>
                        <h4 className="font-semibold mb-3 text-lg">Requirements</h4>
                        <div className="space-y-4">
                            <div>
                                <h5 className="text-sm font-medium mb-1">Artist Type</h5>
                                <div className="flex flex-wrap gap-2">{renderArray(gig.artistType)}</div>
                            </div>
                             <div>
                                <h5 className="text-sm font-medium mb-1">Skills</h5>
                                <div className="flex flex-wrap gap-2">{renderArray(gig.requiredSkills)}</div>
                            </div>
                             <div>
                                <h5 className="text-sm font-medium mb-1">Styles</h5>
                                <div className="flex flex-wrap gap-2">{renderArray(gig.requiredStyles)}</div>
                            </div>
                        </div>
                    </div>
                </div>
                
            </CardContent>
        </Card>
    )
}
