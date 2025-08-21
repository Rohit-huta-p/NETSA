
import type { Gig } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, DollarSign, Briefcase, Star, Clock, Target, Share2, Heart, Drama } from "lucide-react";
import { format } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import Image from "next/image";

interface GigDetailViewProps {
    gig: Gig;
}

const renderArrayAsBadges = (arr: string[] | undefined, variant: "secondary" | "outline" = "secondary") => {
    if (Array.isArray(arr) && arr.length > 0 && arr.filter(item => item).length > 0) {
        return arr.map(item => <Badge key={item} variant={variant} className="capitalize">{item}</Badge>);
    }
    return <span className="text-sm text-muted-foreground">Not specified</span>;
}

export function GigDetailView({ gig }: GigDetailViewProps) {
    const progress = gig.maxApplications ? (gig.currentApplications / gig.maxApplications) * 100 : 0;
    
    return (
        <div className="bg-muted/30 -m-12">
            <div className="container mx-auto py-12">
                <div className="max-w-5xl mx-auto">
                    <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden mb-[-8rem] md:mb-[-10rem]">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                            <Briefcase className="w-24 h-24 text-white/20" />
                        </div>
                        <div className="absolute top-4 right-4 flex gap-2">
                            <Button size="icon" variant="secondary" className="rounded-full bg-white/20 border-none text-white hover:bg-white/30">
                                <Heart className="w-5 h-5"/>
                            </Button>
                            <Button size="icon" variant="secondary" className="rounded-full bg-white/20 border-none text-white hover:bg-white/30">
                                <Share2 className="w-5 h-5"/>
                            </Button>
                        </div>
                    </div>

                    <div className="relative grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                        <div className="lg:col-span-2 space-y-8">
                            <Card className="shadow-xl rounded-2xl">
                                <CardContent className="p-8">
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        <Badge variant="secondary" className="bg-pink-100 text-pink-700 capitalize">{gig.type}</Badge>
                                        <Badge variant="outline" className="capitalize">{gig.experienceLevel.replace('_', ' ')}</Badge>
                                        {gig.tags?.map(tag => <Badge variant="outline" key={tag}>{tag}</Badge>)}
                                    </div>
                                    <h1 className="text-4xl font-bold mb-4">{gig.title}</h1>
                                    
                                     <div className="bg-muted/50 p-4 rounded-lg flex items-center gap-4 mb-6">
                                        <Avatar className="h-12 w-12">
                                            <AvatarImage src={gig.organizerInfo.profileImageUrl} />
                                            <AvatarFallback>{gig.organizerInfo.name.slice(0,2)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-bold">{gig.organizerInfo.name}</p>
                                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                                <span>{gig.organizerInfo.rating} • {gig.organizerInfo.organization}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                                        <div className="flex items-center gap-3">
                                            <Calendar className="w-5 h-5 text-primary" />
                                            <span>{format(new Date(gig.startDate), 'PPP')}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <MapPin className="w-5 h-5 text-primary" />
                                            <span>{gig.location?.isRemote ? 'Remote' : `${gig.location.city}, ${gig.location.country}`}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Users className="w-5 h-5 text-primary" />
                                            <span>{gig.currentApplications} applications</span>
                                        </div>
                                         <div className="flex items-center gap-3">
                                            <Target className="w-5 h-5 text-primary" />
                                            <span>Apply by {gig.applicationDeadline ? format(new Date(gig.applicationDeadline), 'PPP') : 'N/A'}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                             <Card className="shadow-xl rounded-2xl">
                                <CardContent className="p-6">
                                    <Tabs defaultValue="description">
                                        <TabsList className="grid w-full grid-cols-2">
                                            <TabsTrigger value="description">Full Description</TabsTrigger>
                                            <TabsTrigger value="requirements">Artist Requirements</TabsTrigger>
                                        </TabsList>
                                        <TabsContent value="description" className="mt-6">
                                            <h3 className="font-bold text-lg mb-2">About This Gig</h3>
                                            <p className="text-muted-foreground whitespace-pre-line">{gig.description}</p>
                                        </TabsContent>
                                         <TabsContent value="requirements" className="mt-6 space-y-4">
                                            <div>
                                                <h4 className="font-semibold mb-2">Required Artist Types</h4>
                                                <div className="flex flex-wrap gap-2">{renderArrayAsBadges(gig.artistType, "outline")}</div>
                                            </div>
                                            <div>
                                                <h4 className="font-semibold mb-2">Required Skills</h4>
                                                <div className="flex flex-wrap gap-2">{renderArrayAsBadges(gig.requiredSkills, "outline")}</div>
                                            </div>
                                            <div>
                                                <h4 className="font-semibold mb-2">Required Styles</h4>
                                                <div className="flex flex-wrap gap-2">{renderArrayAsBadges(gig.requiredStyles, "outline")}</div>
                                            </div>
                                             <div>
                                                <h4 className="font-semibold">Physical Requirements</h4>
                                                <p className="text-sm text-muted-foreground">{gig.physicalRequirements || "Not specified"}</p>
                                            </div>
                                        </TabsContent>
                                    </Tabs>
                                </CardContent>
                            </Card>
                        </div>

                         <div className="space-y-6 lg:sticky top-24">
                            <Card className="shadow-xl rounded-2xl">
                                <CardContent className="p-6">
                                    <p className="text-3xl font-bold text-center text-primary mb-2">
                                        {gig.compensation.amount ? `${gig.compensation.currency || '$'}${gig.compensation.amount}` : 'Competitive'}
                                    </p>
                                    <p className="text-sm text-center text-muted-foreground mb-4 capitalize">
                                        {gig.compensation.type.replace('_', ' ')} Rate
                                    </p>
                                    
                                    {gig.maxApplications && (
                                        <div className="mb-4">
                                            <p className="text-xs font-medium text-muted-foreground mb-1">Applications:</p>
                                            <Progress value={progress} className="h-2" />
                                        </div>
                                    )}
                                    <Button size="lg" className="w-full font-bold text-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90 transition-opacity">Apply Now</Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
