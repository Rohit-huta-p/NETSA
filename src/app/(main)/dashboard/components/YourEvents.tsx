
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Edit, Drama } from "lucide-react";
import Link from "next/link";

const events = [
    {
        status: "Open",
        title: "Contemporary Dance Workshop",
        date: "Dec 15, 2025 • 7:00 PM",
        location: "Location",
        price: "₹2,500/-",
        applicants: 24,
    },
    {
        status: "Open",
        title: "Hip-Hop Battle Championship",
        date: "Dec 18, 2025 • 6:00 PM",
        location: "Location",
        price: "₹3,000/-",
        applicants: 156,
    },
    {
        status: "Closed",
        title: "Bollywood Dance Workshop",
        date: "Dec 20-21, 2025 • 10:00 AM",
        location: "Location",
        applicants: 120,
        price: "₹1,199/-"
    }
];

export function YourEvents() {
    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Your Events</h2>
                <Button variant="link" className="text-primary">View All &gt;</Button>
            </div>
            <div className="space-y-4">
                {events.map((event, index) => (
                    <Card key={index} className="overflow-hidden">
                        <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="bg-purple-100 dark:bg-purple-900/20 p-4 rounded-lg">
                                    <Drama className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                                </div>
                                <div className="flex-grow">
                                    <Badge variant={event.status === 'Open' ? "secondary" : "outline"} className={event.status === 'Open' ? "bg-blue-100 text-blue-800" : ""}>{event.status}</Badge>
                                    <h3 className="font-bold text-lg mt-1">{event.title}</h3>
                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground mt-1">
                                        <div className="flex items-center gap-1.5"><Calendar className="w-4 h-4"/><span>{event.date}</span></div>
                                        <div className="flex items-center gap-1.5"><MapPin className="w-4 h-4"/><span>{event.location}</span></div>
                                    </div>
                                    <p className="font-bold text-primary mt-2">{event.price}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
                                <Button variant="outline" size="sm">View Applicants ({event.applicants})</Button>
                                <Button variant="ghost" size="icon"><Edit className="w-4 h-4 text-muted-foreground"/></Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
