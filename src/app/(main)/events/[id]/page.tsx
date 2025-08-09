
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, MapPin, Users, Tag, CheckCircle, Share2, Heart, Star, Drama } from "lucide-react";
import { getEvent } from "@/lib/firebase/firestore";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export default async function EventDetailPage({ params }: { params: { id: string } }) {
    const { data: event, error } = await getEvent(params.id);

    if (error || !event) {
        notFound();
    }
    
    // Mock data for attendees until that's implemented
    const attendees = [
        { name: "Alex Rivera", image: "https://placehold.co/40x40.png" },
        { name: "Jordan Kim", image: "https://placehold.co/40x40.png" },
        { name: "Sam Wilson", image: "https://placehold.co/40x40.png" },
        { name: "Casey Brown", image: "https://placehold.co/40x40.png" },
    ];
    
    const spotsRemaining = (event.maxParticipants ?? 0) - (event.currentRegistrations ?? 0);

  return (
    <div className="bg-muted/40 font-body">
        <div className="container mx-auto py-12">
            <div className="max-w-6xl mx-auto">
                {/* Header Image */}
                <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden mb-8 shadow-lg">
                    <Image src={event.thumbnailUrl || "https://placehold.co/1200x400.png"} alt={event.title} layout="fill" objectFit="cover" data-ai-hint="dance event" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-8">
                         <div className="absolute top-4 right-4 flex gap-2">
                            <Button size="icon" variant="ghost" className="bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-sm">
                                <Heart className="w-5 h-5"/>
                            </Button>
                            <Button size="icon" variant="ghost" className="bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-sm">
                                <Share2 className="w-5 h-5"/>
                            </Button>
                        </div>
                        <div className="absolute top-4 left-4 bg-primary/80 backdrop-blur-sm rounded-full p-4">
                           <Drama className="w-8 h-8 text-white"/>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                         <div className="bg-card p-8 rounded-2xl shadow-md border">
                            <div className="flex flex-wrap gap-2 mb-4">
                                <Badge variant="secondary" className="bg-purple-100 text-purple-700 capitalize">{event.category}</Badge>
                                <Badge variant="secondary" className="capitalize">{event.skillLevel.replace('_', ' ')}</Badge>
                                {event.tags?.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
                            </div>
                            <h1 className="text-4xl font-bold font-headline">{event.title}</h1>
                            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-muted-foreground">
                                <div className="flex items-center gap-3">
                                    <Calendar className="w-5 h-5 text-primary" />
                                    <span>{new Date(event.schedule.startDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <MapPin className="w-5 h-5 text-primary" />
                                    <span>{event.location.venue || `${event.location.city}, ${event.location.country}`}</span>
                                </div>
                                 <div className="flex items-center gap-3">
                                    <Clock className="w-5 h-5 text-primary" />
                                    <span>{new Date(event.schedule.startDate).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Users className="w-5 h-5 text-primary" />
                                    <span>{event.currentRegistrations}/{event.maxParticipants} registered</span>
                                </div>
                            </div>
                            <div className="mt-6 pt-6 border-t flex items-center gap-4">
                                <Avatar className="w-12 h-12">
                                    <AvatarImage src={event.hostInfo.profileImageUrl} />
                                    <AvatarFallback>{event.hostInfo.name.slice(0,2)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-bold text-lg">{event.hostInfo.name}</p>
                                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                        <span>{event.hostInfo.rating}</span>
                                        <span className="ml-2">{event.totalReviews} reviews</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Tabs defaultValue="about" className="mt-8">
                            <TabsList className="grid w-full grid-cols-3 bg-muted p-1 h-12">
                                <TabsTrigger value="about">About</TabsTrigger>
                                <TabsTrigger value="attendees">Attendees ({attendees.length})</TabsTrigger>
                                <TabsTrigger value="discussion">Discussion</TabsTrigger>
                            </TabsList>
                             <Card className="mt-4">
                                <TabsContent value="about" className="p-8">
                                    <h2 className="text-2xl font-bold mb-4 font-headline">About This Event</h2>
                                    <p className="text-muted-foreground mb-6 leading-relaxed">{event.description}</p>

                                    <h3 className="text-xl font-bold mb-2 font-headline">What to Expect:</h3>
                                    <ul className="list-disc list-inside text-muted-foreground mb-6 space-y-2">
                                        {event.outcomes?.map(item => <li key={item}>{item}</li>)}
                                    </ul>

                                    <h3 className="text-xl font-bold mb-2 font-headline">Requirements:</h3>
                                    <p className="text-muted-foreground">{event.prerequisites?.join(', ') || "No specific requirements."}</p>
                                </TabsContent>
                                <TabsContent value="attendees" className="p-6">
                                <h2 className="text-2xl font-bold mb-4 font-headline">Who's Coming ({attendees.length})</h2>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {attendees.map(attendee => (
                                            <div key={attendee.name} className="flex items-center gap-3 bg-muted p-3 rounded-lg">
                                                <Avatar>
                                                    <AvatarImage src={attendee.image} />
                                                    <AvatarFallback>{attendee.name.slice(0,2)}</AvatarFallback>
                                                </Avatar>
                                                <span className="font-medium">{attendee.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                </TabsContent>
                                <TabsContent value="discussion" className="p-8 text-center">
                                    <h2 className="text-2xl font-bold mb-4 font-headline">Event Discussion</h2>
                                    <p className="text-muted-foreground mb-4">No comments yet. Be the first to start the conversation!</p>
                                    <Button className="bg-gradient-to-r from-purple-500 to-orange-500 text-white">Add Comment</Button>
                                </TabsContent>
                            </Card>
                        </Tabs>
                    </div>
                    
                    {/* Sidebar */}
                    <div className="space-y-6">
                        <Card className="shadow-lg border">
                            <CardContent className="p-6">
                                <p className="text-sm text-muted-foreground">Price per person</p>
                                <p className="text-4xl font-bold font-headline text-primary mt-1">₹{event.pricing.amount}</p>
                                <div className="mt-4">
                                    <div className="flex justify-between text-sm text-muted-foreground mb-1">
                                        <span>Spots remaining:</span>
                                        <span className="font-bold text-foreground">{spotsRemaining}</span>
                                    </div>
                                    <Progress value={((spotsRemaining ?? 0) / (event.maxParticipants ?? 1)) * 100} className="h-2" />
                                </div>
                                <Button size="lg" className="w-full h-12 text-lg font-bold mt-6 bg-gradient-to-r from-purple-500 to-orange-500 text-white">Register Now</Button>
                                <p className="text-xs text-center text-muted-foreground mt-3">Free cancellation up to 24 hours before the event</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}
