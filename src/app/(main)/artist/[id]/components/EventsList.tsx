
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Calendar, MapPin } from "lucide-react";

export function EventsList() {
    // Mock data for past events. In a real app, you'd fetch this.
    const pastEvents = [
        { title: "Summer Dance Fest", role: "Lead Performer", date: "June 2024", location: "Miami, FL" },
        { title: "The Art of Audition", role: "Attendee", date: "May 2024", location: "Online Workshop" },
        { title: "Community Theatre: 'A Midsummer Night's Dream'", role: "Puck", date: "April 2024", location: "Central Park, NYC" },
    ];

    // For now, upcoming events are empty as per the design.
    const upcomingEvents: any[] = [];

    return (
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle className="text-xl font-bold">Upcoming Event</CardTitle>
                </CardHeader>
                <CardContent>
                    {upcomingEvents.length > 0 ? (
                        <div className="space-y-4">
                            {/* Map over upcoming events here */}
                        </div>
                    ) : (
                        <div className="text-center text-muted-foreground p-8 border-2 border-dashed rounded-lg">
                            No upcoming events scheduled.
                        </div>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-xl font-bold">Past Events</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {pastEvents.map((event, index) => (
                        <Card key={index} className="p-4 shadow-sm">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-semibold text-base">{event.title}</p>
                                    <p className="text-sm text-muted-foreground">{event.role}</p>
                                </div>
                                <div className="flex items-center text-sm text-muted-foreground gap-4 mt-1">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        <span>{event.date}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4" />
                                        <span>{event.location}</span>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </CardContent>
            </Card>
        </div>
    )
}
