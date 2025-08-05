
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Calendar, MapPin } from "lucide-react";

export function EventsList() {
    const events = [
        { title: "Summer Dance Fest", role: "Lead Performer", date: "June 2024", location: "Miami, FL" },
        { title: "The Art of Audition", role: "Attendee", date: "May 2024", location: "Online Workshop" },
        { title: "Community Theatre: 'A Midsummer Night's Dream'", role: "Puck", date: "April 2024", location: "Central Park, NYC" },
    ];
    return (
        <div className="space-y-4">
            {events.map((event, index) => (
                <Card key={index}>
                    <CardHeader>
                        <CardTitle>{event.title}</CardTitle>
                        <CardDescription>{event.role}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex items-center text-sm text-muted-foreground gap-4">
                         <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>{event.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            <span>{event.location}</span>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
