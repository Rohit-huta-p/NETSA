
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Users, Share2, Heart, Star, MapPin, Drama } from "lucide-react";
import { getEvent } from "@/lib/firebase/firestore";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export default async function EventDetailPage({ params }: { params: { id: string } }) {
    const { data: event, error } = await getEvent(params.id);

    if (error || !event) {
        notFound();
    }
    
    const attendees = Array.from({ length: event.currentRegistrations || 0 }, (_, i) => ({
        name: `Attendee ${i + 1}`,
        image: `https://placehold.co/40x40.png?text=A${i+1}`
    }));
    
    const progress = event.maxParticipants ? (event.currentRegistrations / event.maxParticipants) * 100 : 0;

  return (
    <div className="bg-muted/30">
        <div className="container mx-auto py-12">
            <div className="max-w-5xl mx-auto">
                {/* Header Image */}
                <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden mb-[-8rem] md:mb-[-10rem]">
                     <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                        <Drama className="w-24 h-24 text-white/20" />
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
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        <Card className="shadow-xl rounded-2xl">
                            <CardContent className="p-8">
                                <div className="flex flex-wrap gap-2 mb-4">
                                    <Badge variant="secondary" className="bg-pink-100 text-pink-700 capitalize">{event.category}</Badge>
                                    <Badge variant="outline" className="capitalize">{event.skillLevel.replace('_', ' ')}</Badge>
                                </div>
                                <h1 className="text-4xl font-bold mb-4">{event.title}</h1>
                                
                                <div className="bg-muted/50 p-4 rounded-lg flex items-center gap-4 mb-6">
                                     <Avatar className="h-12 w-12">
                                        <AvatarImage src={event.hostInfo.profileImageUrl} />
                                        <AvatarFallback>{event.hostInfo.name.slice(0,2)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-bold">{event.hostInfo.name}</p>
                                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                            <span>{event.hostInfo.rating} • 47 events</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-3">
                                        <Calendar className="w-5 h-5 text-primary" />
                                        <span>{new Date(event.schedule.startDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <MapPin className="w-5 h-5 text-primary" />
                                        <span>{event.location.venue || 'Online'}</span>
                                    </div>
                                     <div className="flex items-center gap-3">
                                        <Users className="w-5 h-5 text-primary" />
                                        <span>{event.currentRegistrations} / {event.maxParticipants} registered</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="shadow-xl rounded-2xl">
                            <CardContent className="p-6">
                                <Tabs defaultValue="about">
                                    <TabsList className="grid w-full grid-cols-3">
                                        <TabsTrigger value="about">About</TabsTrigger>
                                        <TabsTrigger value="attendees">Attendees ({attendees.length})</TabsTrigger>
                                        <TabsTrigger value="discussion">Discussion</TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="about" className="mt-6">
                                         <h3 className="font-bold text-lg mb-2">About This Event</h3>
                                        <p className="text-muted-foreground whitespace-pre-line">{event.description}</p>
                                        
                                        <h3 className="font-bold mt-6 mb-2 text-lg">What to Expect:</h3>
                                        <ul className="list-disc list-inside text-muted-foreground space-y-1">
                                            <li>Warm-up and technique practice</li>
                                            <li>Learning contemporary movement phrases</li>
                                            <li>Improvisation exercises</li>
                                            <li>Cool-down and reflection</li>
                                        </ul>

                                        <h3 className="font-bold mt-6 mb-2 text-lg">Requirements:</h3>
                                        <p className="text-muted-foreground">No prior experience required. Wear comfortable clothes and bring water.</p>
                                    </TabsContent>
                                    <TabsContent value="attendees" className="mt-4">
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            {attendees.map(attendee => (
                                                <div key={attendee.name} className="flex items-center gap-2">
                                                    <Avatar>
                                                        <AvatarImage src={attendee.image} />
                                                        <AvatarFallback>{attendee.name.slice(0,2)}</AvatarFallback>
                                                    </Avatar>
                                                    <span className="text-sm font-medium">{attendee.name}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </TabsContent>
                                    <TabsContent value="discussion" className="mt-4 text-center">
                                        <p className="text-muted-foreground">No comments yet.</p>
                                        <Button className="mt-2">Add Comment</Button>
                                    </TabsContent>
                                </Tabs>
                            </CardContent>
                        </Card>
                    </div>
                    
                    {/* Sidebar */}
                    <div className="space-y-6 lg:sticky top-24">
                        <Card className="shadow-xl rounded-2xl">
                            <CardContent className="p-6">
                                <p className="text-3xl font-bold text-center text-primary mb-2">${event.pricing.amount}/-</p>
                                <p className="text-sm text-center text-muted-foreground mb-4">per person</p>
                                
                                <div className="mb-4">
                                    <p className="text-xs font-medium text-muted-foreground mb-1">Spots remaining:</p>
                                    <Progress value={progress} className="h-2" />
                                </div>
                                <Button size="lg" className="w-full font-bold text-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90 transition-opacity">Register Now</Button>
                                <p className="text-xs text-center text-muted-foreground mt-3">Free cancellation up to 24 hours before event</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}
