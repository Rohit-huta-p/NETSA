
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, MapPin, User, Users, Tag, CheckCircle } from "lucide-react";

export default function EventDetailPage({ params }: { params: { id: string } }) {
    // Mock data - in a real app, you'd fetch this based on params.id
    const event = {
        title: "Contemporary Dance Workshop",
        organizer: "Maria Santos",
        organizerRole: "Internationally Acclaimed Choreographer",
        date: "Dec 15, 2024",
        time: "7:00 PM - 9:00 PM",
        location: "Downtown Studio, NYC",
        price: 45,
        attendeesCount: 18,
        image: "https://placehold.co/1200x400.png",
        imageHint: "contemporary dance",
        organizerImage: "https://placehold.co/100x100.png",
        organizerImageHint: "woman smiling",
        about: "Explore fluid movements and emotional expression in this intensive contemporary dance workshop led by internationally acclaimed choreographer Maria Santos. This workshop will focus on developing your personal movement style while mastering fundamental contemporary techniques.",
        whatToExpect: [
            "Warm-up and technique practice",
            "Learning contemporary movement phrases",
            "Improvisation exercises",
            "Cool-down and reflection",
        ],
        requirements: "No prior experience required. Wear comfortable clothes and bring water.",
    };

    const attendees = [
        { name: "Alex Rivera", image: "https://placehold.co/40x40.png" },
        { name: "Jordan Kim", image: "https://placehold.co/40x40.png" },
        { name: "Sam Wilson", image: "https://placehold.co/40x40.png" },
        { name: "Casey Brown", image: "https://placehold.co/40x40.png" },
    ];

  return (
    <div className="bg-muted/40">
        <div className="container mx-auto py-8">
            {/* Header */}
            <div className="relative h-64 md:h-80 rounded-lg overflow-hidden mb-8">
                <Image src={event.image} alt={event.title} layout="fill" objectFit="cover" data-ai-hint={event.imageHint} />
                <div className="absolute inset-0 bg-black/50 flex flex-col justify-end p-8">
                    <h1 className="text-4xl md:text-5xl font-bold text-white">{event.title}</h1>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2">
                    <Tabs defaultValue="about">
                        <TabsList>
                            <TabsTrigger value="about">About</TabsTrigger>
                            <TabsTrigger value="attendees">Attendees ({event.attendeesCount})</TabsTrigger>
                            <TabsTrigger value="discussion">Discussion</TabsTrigger>
                        </TabsList>
                        <Card className="mt-4">
                            <TabsContent value="about" className="p-6">
                                <h2 className="text-2xl font-bold mb-4">About This Event</h2>
                                <p className="text-muted-foreground mb-6">{event.about}</p>

                                <h3 className="text-xl font-bold mb-2">What to Expect:</h3>
                                <ul className="list-disc list-inside text-muted-foreground mb-6 space-y-1">
                                    {event.whatToExpect.map(item => <li key={item}>{item}</li>)}
                                </ul>

                                <h3 className="text-xl font-bold mb-2">Requirements:</h3>
                                <p className="text-muted-foreground">{event.requirements}</p>
                            </TabsContent>
                            <TabsContent value="attendees" className="p-6">
                               <h2 className="text-2xl font-bold mb-4">Who's Coming ({attendees.length})</h2>
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
                            <TabsContent value="discussion" className="p-6 text-center">
                                <h2 className="text-2xl font-bold mb-4">Event Discussion</h2>
                                <p className="text-muted-foreground mb-4">No comments yet. Be the first to start the conversation!</p>
                                <Button className="bg-gradient-to-r from-purple-500 to-orange-500 text-white">Add Comment</Button>
                            </TabsContent>
                        </Card>
                    </Tabs>
                </div>
                
                {/* Sidebar */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Event Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-muted-foreground">
                            <div className="flex items-start gap-3"><Calendar className="w-5 h-5 mt-1" /><div><p className="font-semibold text-foreground">Date</p><p>{event.date}</p></div></div>
                            <div className="flex items-start gap-3"><Clock className="w-5 h-5 mt-1" /><div><p className="font-semibold text-foreground">Time</p><p>{event.time}</p></div></div>
                            <div className="flex items-start gap-3"><MapPin className="w-5 h-5 mt-1" /><div><p className="font-semibold text-foreground">Location</p><p>{event.location}</p></div></div>
                            <div className="flex items-start gap-3"><Tag className="w-5 h-5 mt-1" /><div><p className="font-semibold text-foreground">Price</p><p>${event.price}</p></div></div>
                            <div className="flex items-start gap-3"><Users className="w-5 h-5 mt-1" /><div><p className="font-semibold text-foreground">Attendees</p><p>{event.attendeesCount} attending</p></div></div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Organizer</CardTitle>
                        </CardHeader>
                        <CardContent className="flex items-center gap-4">
                             <Avatar className="w-16 h-16">
                                <AvatarImage src={event.organizerImage} data-ai-hint={event.organizerImageHint} />
                                <AvatarFallback>{event.organizer.slice(0,2)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-bold text-lg flex items-center gap-1">{event.organizer} <CheckCircle className="w-4 h-4 text-blue-500" /></p>
                                <p className="text-sm text-muted-foreground">{event.organizerRole}</p>
                            </div>
                        </CardContent>
                    </Card>
                     <Button size="lg" className="w-full h-12 text-lg bg-gradient-to-r from-purple-500 to-orange-500 text-white">Register for this Event</Button>
                </div>
            </div>
        </div>
    </div>
  );
}
