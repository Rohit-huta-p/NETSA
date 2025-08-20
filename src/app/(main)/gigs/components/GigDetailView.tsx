
import type { Gig } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, DollarSign, Briefcase, Star, Clock, Target, Share2, Heart, CheckCircle } from "lucide-react";
import { format } from "date-fns";
import Image from "next/image";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";


interface GigDetailViewProps {
    gig: Gig;
}

const renderArrayAsBadges = (arr: string[] | undefined) => {
    if (Array.isArray(arr) && arr.length > 0 && arr.filter(item => item).length > 0) {
        return arr.map(item => <Badge key={item} variant="secondary">{item}</Badge>);
    }
    return <span className="text-sm text-muted-foreground">Not specified</span>;
}

const tagColorMap: { [key: string]: string } = {
    performance: "bg-primary/10 text-primary",
    photoshoot: "bg-pink-100 text-pink-800",
    recording: "bg-blue-100 text-blue-800",
    event: "bg-green-100 text-green-800",
    audition: "bg-yellow-100 text-yellow-800",
    modeling: "bg-indigo-100 text-indigo-800",
    teaching: "bg-teal-100 text-teal-800",
    collaboration: "bg-gray-100 text-gray-800",
};

export function GigDetailView({ gig }: GigDetailViewProps) {
    const spotsRemaining = (gig.maxApplications ?? 0) - (gig.currentApplications ?? 0);
    const spotsFilledPercentage = gig.maxApplications && gig.maxApplications > 0 ? ((gig.currentApplications ?? 0) / gig.maxApplications) * 100 : 0;
    
    return (
        <div className="font-body">
            <div className="max-w-6xl mx-auto">
                 {/* Header Image */}
                 <div className="relative h-64 md:h-80 rounded-t-2xl overflow-hidden shadow-lg">
                    <Image src={"https://placehold.co/1200x400.png"} alt={gig.title} layout="fill" objectFit="cover" data-ai-hint="performance stage" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"></div>
                     <div className="absolute top-4 right-4 flex gap-2">
                        <Button size="icon" variant="ghost" className="bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-sm">
                            <Heart className="w-5 h-5"/>
                        </Button>
                        <Button size="icon" variant="ghost" className="bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-sm">
                            <Share2 className="w-5 h-5"/>
                        </Button>
                    </div>
                    <div className="absolute top-4 left-4 bg-primary/80 backdrop-blur-sm rounded-full p-4">
                       <Briefcase className="w-8 h-8 text-white"/>
                    </div>
                </div>

                 <div className="bg-card p-6 sm:p-8 rounded-b-2xl shadow-md border grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        <div className="flex flex-wrap gap-2 mb-4">
                            <Badge className={cn("capitalize font-semibold", tagColorMap[gig.type] || 'bg-gray-200 text-gray-800')}>{gig.type}</Badge>
                            <Badge variant="secondary" className="capitalize">{gig.experienceLevel.replace('_', ' ')}</Badge>
                             <Badge variant="outline" className="capitalize">{gig.category}</Badge>
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-bold font-headline">{gig.title}</h1>
                        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-muted-foreground">
                             <div className="flex items-start gap-3">
                                <Calendar className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                                <div>
                                    <p>Starts {format(new Date(gig.startDate), 'PPP')}</p>
                                    <p className="text-sm">Apply by {gig.applicationDeadline ? format(new Date(gig.applicationDeadline), 'PPP') : 'N/A'}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                                 <div>
                                    <p>{gig.location.isRemote ? 'Remote' : gig.location.venue || 'TBD'}</p>
                                    <p className="text-sm">{gig.location.city}, {gig.location.country}</p>
                                </div>
                            </div>
                             <div className="flex items-start gap-3">
                                <DollarSign className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                                <div>
                                    <p className="capitalize">{gig.compensation.amount ? `${gig.compensation.currency || ''}${gig.compensation.amount}` : 'Not specified'}</p>
                                    <p className="text-sm capitalize">{gig.compensation.type.replace('_', ' ')}</p>
                                </div>
                            </div>
                        </div>
                         <div className="mt-6 pt-6 border-t flex items-center gap-4">
                            <Avatar className="w-12 h-12">
                                <AvatarImage src={gig.organizerInfo.profileImageUrl} />
                                <AvatarFallback>{gig.organizerInfo.name.slice(0,2)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-bold text-lg">{gig.organizerInfo.name}</p>
                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                    <span>{gig.organizerInfo.organization}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Sidebar */}
                    <div className="space-y-6">
                        <Card className="shadow-lg border bg-muted/30">
                            <CardContent className="p-6 text-center">
                                <p className="text-4xl font-bold font-headline text-primary">Apply</p>
                                <p className="text-sm text-muted-foreground">Applications close soon</p>
                                 <div className="mt-4">
                                    <div className="flex justify-between text-sm text-muted-foreground mb-1">
                                        <span>Applications: {gig.currentApplications} / {gig.maxApplications || '∞'}</span>
                                    </div>
                                    <Progress value={spotsFilledPercentage} className="h-2" />
                                </div>
                                <Button size="lg" className="w-full h-12 text-lg font-bold mt-6">Apply Now</Button>
                                <p className="text-xs text-center text-muted-foreground mt-3">Applications are reviewed on a rolling basis</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <Tabs defaultValue="description" className="mt-8">
                     <TabsList className="grid w-full grid-cols-2 bg-card p-1 h-auto rounded-lg shadow-sm border">
                        <TabsTrigger value="description" className="py-2.5">Description</TabsTrigger>
                        <TabsTrigger value="requirements">Requirements</TabsTrigger>
                    </TabsList>
                     <Card className="mt-4 rounded-2xl shadow-md border">
                        <TabsContent value="description" className="p-6 sm:p-8 space-y-6">
                            <div>
                                <h2 className="text-2xl font-bold mb-4 font-headline">Job Description</h2>
                                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{gig.description}</p>
                            </div>
                             {gig.compensation.additionalBenefits && gig.compensation.additionalBenefits.length > 0 && (
                                <div>
                                    <h3 className="text-xl font-bold mb-3 font-headline">Benefits</h3>
                                    <ul className="list-disc list-inside text-muted-foreground space-y-2">
                                        {gig.compensation.additionalBenefits.map(item => <li key={item}>{item}</li>)}
                                    </ul>
                                </div>
                            )}
                        </TabsContent>
                         <TabsContent value="requirements" className="p-6 sm:p-8 space-y-6">
                            <div>
                                <h3 className="text-xl font-bold mb-3 font-headline">Required Artist Types</h3>
                                <div className="flex flex-wrap gap-2">{renderArrayAsBadges(gig.artistType)}</div>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold mb-3 font-headline">Required Skills</h3>
                                <div className="flex flex-wrap gap-2">{renderArrayAsBadges(gig.requiredSkills)}</div>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold mb-3 font-headline">Required Styles</h3>
                                <div className="flex flex-wrap gap-2">{renderArrayAsBadges(gig.requiredStyles)}</div>
                            </div>
                             {gig.physicalRequirements && (
                                <div>
                                    <h3 className="text-xl font-bold mb-3 font-headline">Physical Requirements</h3>
                                    <p className="text-muted-foreground">{gig.physicalRequirements}</p>
                                </div>
                            )}
                        </TabsContent>
                    </Card>
                </Tabs>
            </div>
        </div>
    )
}
