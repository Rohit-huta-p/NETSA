
"use client";

import type { Gig } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, DollarSign, Briefcase, Star, Clock, Target, Share2, Heart, Drama, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import Image from "next/image";
import { useUser } from "@/hooks/useUser";
import { useState } from "react";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";

interface GigDetailViewProps {
    gig: Gig;
}

const renderArrayAsBadges = (arr: string[] | undefined, variant: "secondary" | "outline" = "secondary") => {
    if (Array.isArray(arr) && arr.length > 0 && arr.filter(item => item).length > 0) {
        return arr.map(item => <Badge key={item} variant={variant} className="capitalize">{item}</Badge>);
    }
    return <span className="text-sm text-muted-foreground">Not specified</span>;
}

function DiscussionTabContent() {
    return (
        <div className="text-center py-8">
            <h3 className="font-bold text-lg mb-2">Event Discussion</h3>
            <p className="text-muted-foreground">No comments yet. Be the first to start the conversation!</p>
            <Button className="mt-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90 transition-opacity">Add Comment</Button>
        </div>
    )
}

function ApplicationsTabContent() {
    // Placeholder for applications, you can fetch and display real data here
     const applications = [
        { name: 'John Doe', status: 'Pending' },
        { name: 'Jane Smith', status: 'Shortlisted' },
    ];
    return (
        <div className="space-y-4">
            <h3 className="font-bold text-lg mb-2">Applications ({applications.length})</h3>
            {applications.map((app, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <p className="font-medium">{app.name}</p>
                    <Badge variant={app.status === 'Shortlisted' ? 'default' : 'outline'}>{app.status}</Badge>
                </div>
            ))}
        </div>
    )
}


export function GigDetailView({ gig }: GigDetailViewProps) {
    const { user } = useUser();
    const { toast } = useToast();
    const [isApplying, setIsApplying] = useState(false);
    const isOrganizer = user?.id === gig.organizerId;
    const progress = gig.maxApplications ? (gig.currentApplications / gig.maxApplications) * 100 : 0;

    const handleApply = async () => {
        if (!user || user.role !== 'artist') {
            toast({ variant: 'destructive', title: 'Error', description: 'You must be logged in as an artist to apply.' });
            return;
        }

        setIsApplying(true);
        try {
            const token = user.token;
            await axios.post(`/api/gigs/${gig.id}/apply`, {}, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            toast({ title: 'Success!', description: 'Your application has been submitted.' });
        } catch (error: any) {
            const message = error.response?.data?.message || 'An error occurred while applying.';
            toast({ variant: 'destructive', title: 'Application Failed', description: message });
        } finally {
            setIsApplying(false);
        }
    }

    return (
        <div className="">
            <div className="">
                <div className="max-w-5xl mx-auto">
                    <Card className="shadow-xl rounded-2xl ">
                        <CardContent className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="md:col-span-2 space-y-6">
                                <div className="flex flex-wrap gap-2">
                                    <Badge variant="secondary" className="bg-pink-100 text-pink-700 capitalize">{gig.type}</Badge>
                                    <Badge variant="outline" className="capitalize">{gig.experienceLevel.replace('_', ' ')}</Badge>
                                    {gig.tags?.map(tag => <Badge variant="outline" key={tag}>{tag}</Badge>)}
                                </div>
                                
                                <h1 className="text-4xl font-bold font-headline">{gig.title}</h1>

                                <div className="bg-muted/50 p-4 rounded-lg flex items-center gap-4">
                                    <Avatar className="h-12 w-12">
                                        <AvatarImage src={gig.organizerInfo.profileImageUrl} />
                                        <AvatarFallback>{gig.organizerInfo.name.slice(0, 2)}</AvatarFallback>
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
                            </div>

                            <div className="md:col-span-1">
                                <Card className="shadow-lg rounded-xl border-2 border-primary/10">
                                    <CardContent className="p-6">
                                        <p className="text-3xl font-bold text-center text-primary mb-1">
                                            {gig.compensation.amount ? `${gig.compensation.currency || '$'}${gig.compensation.amount}` : 'Competitive'}
                                        </p>
                                        <p className="text-sm text-center text-muted-foreground mb-4 capitalize">
                                            {gig.compensation.type.replace('_', ' ')} Rate
                                        </p>

                                        {gig.maxApplications && (
                                            <div className="mb-4">
                                                <div className="flex justify-between items-center text-xs font-medium text-muted-foreground mb-1">
                                                    <p>Applications:</p>
                                                    <p className="text-primary font-bold">{gig.currentApplications} / {gig.maxApplications}</p>
                                                </div>
                                                <Progress value={progress} className="h-2" />
                                            </div>
                                        )}
                                        <Button 
                                            size="lg" 
                                            className="w-full font-bold text-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90 transition-opacity"
                                            onClick={isOrganizer ? undefined : handleApply}
                                            disabled={isApplying}
                                        >
                                            {isApplying ? (
                                                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Applying...</>
                                            ) : (
                                                isOrganizer ? 'View Applications' : 'Apply Now'
                                            )}
                                        </Button>
                                    </CardContent>
                                </Card>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="mt-8">
                         <Tabs defaultValue="about">
                            <TabsList className="grid lg:grid-cols-3 bg-[#F1F5F9] mb-6">
                                <TabsTrigger value="about" className="text-md rounded-md w-full px-8 py-2 data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-lg">About</TabsTrigger>
                                <TabsTrigger value="requirements" className="text-md  rounded-md w-full px-8 py-2 data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-lg">
                                    {isOrganizer ? "Applications" : "Requirements"}
                                </TabsTrigger>
                                <TabsTrigger value="discussion" className="text-md rounded-md w-full px-8 py-2 data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-lg">Discussion</TabsTrigger>
                            </TabsList>
                            <Card className="shadow-xl rounded-2xl">
                               <CardContent className="p-8">
                                    <TabsContent value="about">
                                        <h3 className="font-bold text-lg mb-2">About This Gig</h3>
                                        <p className="text-muted-foreground whitespace-pre-line">{gig.description}</p>
                                    </TabsContent>
                                    <TabsContent value="requirements">
                                         {isOrganizer ? <ApplicationsTabContent /> : (
                                            <div className="space-y-4">
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
                                            </div>
                                        )}
                                    </TabsContent>
                                    <TabsContent value="discussion">
                                        <DiscussionTabContent />
                                    </TabsContent>
                               </CardContent>
                            </Card>
                        </Tabs>
                    </div>
                </div>
            </div>
        </div>
    )
}
