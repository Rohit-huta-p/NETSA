
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    const spotsRemaining = event.maxParticipants - event.currentRegistrations;

  return (
    <div className="bg-muted/30">
        <div className="container mx-auto py-12">
            <div className="max-w-5xl mx-auto">
                <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden shadow-lg">
                     <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                        <Drama className="w-24 h-24 text-white/20" />
                    </div>
                     <div className="absolute top-4 right-4 flex gap-2">
                        <Button size="icon" variant="secondary" className="rounded-full bg-white/20 border-none text-white hover:bg-white/30 backdrop-blur-sm">
                            <Heart className="w-5 h-5"/>
                        </Button>
                        <Button size="icon" variant="secondary" className="rounded-full bg-white/20 border-none text-white hover:bg-white/30 backdrop-blur-sm">
                            <Share2 className="w-5 h-5"/>
                        </Button>
                    </div>
                </div>

                <Card className="shadow-xl rounded-2xl -mt-24">
                    <CardContent className="p-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="md:col-span-2 space-y-6">
                                <div className="flex flex-wrap gap-2">
                                    <Badge variant="secondary" className="bg-primary/10 text-primary capitalize">{event.category}</Badge>
                                    <Badge variant="outline">Contemporary</Badge>
                                    <Badge variant="outline" className="capitalize">{event.skillLevel.replace('_', ' ')}</Badge>
                                    <Badge variant="outline">Technique</Badge>
                                </div>
                                
                                <h1 className="text-4xl font-bold font-headline">{event.title}</h1>
                                
                                <div className="bg-muted/50 p-4 rounded-lg flex items-center gap-4">
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

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-3">
                                        <Calendar className="w-5 h-5 text-primary" />
                                        <div>
                                            <p className="font-medium text-foreground">{new Date(event.schedule.startDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                                            <p>{new Date(event.schedule.startDate).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })} - {new Date(event.schedule.endDate).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <MapPin className="w-5 h-5 text-primary" />
                                        <span className="font-medium text-foreground">{event.location.venue || 'Online'}</span>
                                    </div>
                                     <div className="flex items-center gap-3">
                                        <Users className="w-5 h-5 text-primary" />
                                        <span className="font-medium text-foreground">{event.currentRegistrations} / {event.maxParticipants} registered</span>
                                    </div>
                                </div>
                            </div>

                            <div className="md:col-span-1">
                                <Card className="shadow-lg rounded-xl border-2 border-primary/10">
                                    <CardContent className="p-6">
                                        <p className="text-3xl font-bold text-center text-primary mb-1">₹{event.pricing.amount}/-</p>
                                        <p className="text-sm text-center text-muted-foreground mb-4">per person</p>
                                        
                                        <div className="mb-4">
                                            <div className="flex justify-between items-center text-xs font-medium text-muted-foreground mb-1">
                                                <p>Spots remaining:</p>
                                                <p className="text-primary font-bold">{spotsRemaining}</p>
                                            </div>
                                            <Progress value={progress} className="h-2" />
                                        </div>
                                        <Button size="lg" className="w-full font-bold text-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90 transition-opacity">Register Now</Button>
                                        <p className="text-xs text-center text-muted-foreground mt-3">Free cancellation up to 24 hours before event</p>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="mt-8">
                     <Tabs defaultValue="about">
                        <TabsList className="flex justify-center bg-transparent mb-6">
                            <TabsTrigger value="about" className="text-lg px-8 py-2 rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg">About</TabsTrigger>
                            <TabsTrigger value="attendees" className="text-lg px-8 py-2 rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg">Attendees ({attendees.length})</TabsTrigger>
                            <TabsTrigger value="discussion" className="text-lg px-8 py-2 rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg">Discussion</TabsTrigger>
                        </TabsList>
                        <Card className="shadow-xl rounded-2xl">
                           <CardContent className="p-8">
                                <TabsContent value="about">
                                     <h3 className="font-bold text-xl mb-4">About This Event</h3>
                                    <p className="text-muted-foreground whitespace-pre-line leading-relaxed">{event.description}</p>
                                    
                                    <h3 className="font-bold mt-6 mb-2 text-xl">What to Expect:</h3>
                                    <ul className="list-disc list-inside text-muted-foreground space-y-1 pl-2">
                                        <li>Warm-up and technique practice</li>
                                        <li>Learning contemporary movement phrases</li>
                                        <li>Improvisation exercises</li>
                                        <li>Cool-down and reflection</li>
                                    </ul>

                                    <h3 className="font-bold mt-6 mb-2 text-xl">Requirements:</h3>
                                    <p className="text-muted-foreground pl-2">No prior experience required. Wear comfortable clothes and bring water.</p>
                                </TabsContent>
                                <TabsContent value="attendees">
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {attendees.map(attendee => (
                                            <div key={attendee.name} className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
                                                <Avatar>
                                                    <AvatarImage src={attendee.image} />
                                                    <AvatarFallback>{attendee.name.slice(0,2)}</AvatarFallback>
                                                </Avatar>
                                                <span className="text-sm font-medium">{attendee.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                </TabsContent>
                                <TabsContent value="discussion" className="text-center py-8">
                                    <p className="text-muted-foreground">No comments yet.</p>
                                    <Button className="mt-4">Add Comment</Button>
                                </TabsContent>
                           </CardContent>
                        </Card>
                    </Tabs>
                </div>
            </div>
        </div>
    </div>
  );
}
