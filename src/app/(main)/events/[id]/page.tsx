
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, MapPin, Users, Share2, Heart, Star } from "lucide-react";
import { getEvent } from "@/lib/firebase/firestore";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";

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
        { name: "Maria Garcia", image: "https://placehold.co/40x40.png" },
        { name: "Ben Carter", image: "https://placehold.co/40x40.png" },
    ];

  return (
    <div className="bg-muted/40">
        <div className="container mx-auto py-12">
            <div className="max-w-4xl mx-auto">
                {/* Header Image */}
                <div className="relative h-64 md:h-80 rounded-lg overflow-hidden mb-8">
                    <Image src={event.thumbnailUrl || "https://placehold.co/1200x400.png"} alt={event.title} layout="fill" objectFit="cover" data-ai-hint="dance event" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    <div className="absolute bottom-6 left-6">
                        <h1 className="text-4xl font-bold text-white">{event.title}</h1>
                    </div>
                     <div className="absolute top-4 right-4 flex gap-2">
                        <Button size="icon" variant="secondary" className="rounded-full">
                            <Heart className="w-5 h-5"/>
                        </Button>
                        <Button size="icon" variant="secondary" className="rounded-full">
                            <Share2 className="w-5 h-5"/>
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardContent className="p-6">
                                <Tabs defaultValue="about">
                                    <TabsList>
                                        <TabsTrigger value="about">About</TabsTrigger>
                                        <TabsTrigger value="attendees">Attendees ({attendees.length})</TabsTrigger>
                                        <TabsTrigger value="discussion">Discussion</TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="about" className="mt-4">
                                        <p className="text-muted-foreground whitespace-pre-line">{event.description}</p>
                                        
                                        <h3 className="font-bold mt-4 mb-2">What to Expect:</h3>
                                        <ul className="list-disc list-inside text-muted-foreground">
                                            {event.outcomes?.map(item => <li key={item}>{item}</li>)}
                                        </ul>

                                        <h3 className="font-bold mt-4 mb-2">Requirements:</h3>
                                        <p className="text-muted-foreground">{event.prerequisites?.join(', ') || "No specific requirements."}</p>
                                    </TabsContent>
                                    <TabsContent value="attendees" className="mt-4">
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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
                    <div className="space-y-6">
                        <Card>
                            <CardContent className="p-6">
                                <Button size="lg" className="w-full">Register Now (${event.pricing.amount})</Button>
                                <p className="text-xs text-center text-muted-foreground mt-2">Free cancellation up to 24 hours before event</p>
                            </CardContent>
                        </Card>
                         <Card>
                            <CardContent className="p-6 space-y-4">
                               <div className="flex items-center gap-2">
                                 <Calendar className="w-5 h-5 text-muted-foreground" />
                                 <p>{new Date(event.schedule.startDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                               </div>
                                <div className="flex items-center gap-2">
                                 <Clock className="w-5 h-5 text-muted-foreground" />
                                 <p>{new Date(event.schedule.startDate).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</p>
                               </div>
                               <div className="flex items-center gap-2">
                                 <MapPin className="w-5 h-5 text-muted-foreground" />
                                 <p>{event.location.venue || 'Online'}</p>
                               </div>
                               <div className="flex items-center gap-2">
                                 <Users className="w-5 h-5 text-muted-foreground" />
                                 <p>{event.currentRegistrations} / {event.maxParticipants} spots filled</p>
                               </div>
                                <div className="flex flex-wrap gap-1">
                                    <Badge variant="secondary" className="capitalize">{event.category}</Badge>
                                    <Badge variant="outline" className="capitalize">{event.skillLevel.replace('_', ' ')}</Badge>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                             <CardContent className="p-6">
                                <h3 className="font-bold mb-4">Hosted by</h3>
                                <div className="flex items-center gap-4">
                                    <Avatar>
                                        <AvatarImage src={event.hostInfo.profileImageUrl} />
                                        <AvatarFallback>{event.hostInfo.name.slice(0,2)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-bold">{event.hostInfo.name}</p>
                                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                            <span>{event.hostInfo.rating} • {event.totalReviews} events</span>
                                        </div>
                                    </div>
                                </div>
                             </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}
