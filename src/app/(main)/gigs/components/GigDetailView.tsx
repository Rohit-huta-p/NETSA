
import type { Gig } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, DollarSign, Briefcase, Star, Clock, Target } from "lucide-react";
import { format } from "date-fns";

interface GigDetailViewProps {
    gig: Gig;
}

const renderArrayAsBadges = (arr: string[] | undefined) => {
    if (Array.isArray(arr) && arr.length > 0 && arr.filter(item => item).length > 0) {
        return arr.map(item => <Badge key={item} variant="secondary">{item}</Badge>);
    }
    return <span className="text-sm text-muted-foreground">Not specified</span>;
}

export function GigDetailView({ gig }: GigDetailViewProps) {
    return (
        <Card className="overflow-hidden">
            <CardHeader className="bg-muted/50 p-6 border-b">
                <div className="flex justify-between items-start">
                    <div>
                        <Badge className="mb-2 capitalize">{gig.type}</Badge>
                        <CardTitle className="text-2xl">{gig.title}</CardTitle>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                            <Briefcase className="w-4 h-4"/>
                            <span>{gig.organizerInfo.organization}</span>
                            <span className="text-lg">·</span>
                            <MapPin className="w-4 h-4"/>
                            <span>{gig.location.isRemote ? 'Remote' : `${gig.location.city}, ${gig.location.country}`}</span>
                        </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                        <p className="text-xl font-bold text-primary">
                            {gig.compensation.amount ? `${gig.compensation.currency || '$'}${gig.compensation.amount}` : 'Competitive'}
                        </p>
                        <p className="text-sm text-muted-foreground capitalize">
                            {gig.compensation.type.replace('_', ' ')}
                        </p>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-6 grid md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-6">
                    <div>
                        <h3 className="font-semibold text-lg mb-2">Description</h3>
                        <p className="text-muted-foreground whitespace-pre-line">{gig.description}</p>
                    </div>

                     <div>
                        <h3 className="font-semibold text-lg mb-2">Artist Requirements</h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div><p className="text-muted-foreground">Experience</p><p className="font-medium capitalize">{gig.experienceLevel.replace('_', ' ')}</p></div>
                            <div><p className="text-muted-foreground">Gender</p><p className="font-medium capitalize">{gig.genderPreference || 'Any'}</p></div>
                        </div>
                         <div className="mt-4">
                             <p className="text-muted-foreground text-sm">Required Artist Types</p>
                             <div className="flex flex-wrap gap-1 mt-1">{renderArrayAsBadges(gig.artistType)}</div>
                        </div>
                        <div className="mt-4">
                             <p className="text-muted-foreground text-sm">Required Skills</p>
                             <div className="flex flex-wrap gap-1 mt-1">{renderArrayAsBadges(gig.requiredSkills)}</div>
                        </div>
                         <div className="mt-4">
                             <p className="text-muted-foreground text-sm">Required Styles</p>
                             <div className="flex flex-wrap gap-1 mt-1">{renderArrayAsBadges(gig.requiredStyles)}</div>
                        </div>
                    </div>
                </div>
                <div className="space-y-6">
                    <Button size="lg" className="w-full">Apply Now</Button>
                    <Card className="bg-muted/50">
                        <CardHeader>
                           <CardTitle className="text-base">About the Organizer</CardTitle>
                        </CardHeader>
                        <CardContent>
                             <div className="flex items-center gap-3">
                                <Avatar>
                                    <AvatarImage src={gig.organizerInfo.profileImageUrl} />
                                    <AvatarFallback>{gig.organizerInfo.name.slice(0,2)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold">{gig.organizerInfo.name}</p>
                                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                        <Star className="w-4 h-4 text-yellow-400" />
                                        <span>{gig.organizerInfo.rating} Rating</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                     <Card className="bg-muted/50">
                        <CardHeader>
                            <CardTitle className="text-base">Key Details</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm space-y-3">
                            <div className="flex items-start gap-2">
                                <Calendar className="w-4 h-4 mt-0.5 text-muted-foreground"/>
                                <div>
                                    <span className="font-semibold">Dates:</span> {format(new Date(gig.startDate), 'PPP')}
                                    {gig.endDate && ` - ${format(new Date(gig.endDate), 'PPP')}`}
                                </div>
                            </div>
                             <div className="flex items-start gap-2">
                                <Clock className="w-4 h-4 mt-0.5 text-muted-foreground"/>
                                <div>
                                    <span className="font-semibold">Commitment:</span> {gig.timeCommitment || 'Not specified'}
                                </div>
                            </div>
                            <div className="flex items-start gap-2">
                                <Target className="w-4 h-4 mt-0.5 text-muted-foreground"/>
                                <div>
                                    <span className="font-semibold">Apply by:</span> {gig.applicationDeadline ? format(new Date(gig.applicationDeadline), 'PPP') : 'Open until filled'}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </CardContent>
        </Card>
    )
}
