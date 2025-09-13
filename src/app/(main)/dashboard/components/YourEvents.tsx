
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Edit, Drama } from "lucide-react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getEvents } from "@/lib/firebase/firestore";
import { useUser } from "@/hooks/useUser";
import { Skeleton } from "@/components/ui/skeleton";

const fetchMyEvents = async (organizerId: string) => {
    const { data, error } = await getEvents(organizerId);
    if (error) {
        throw new Error(error);
    }
    return data;
}

export function YourEvents() {
    const { user } = useUser();

    const { data: events, isLoading } = useQuery({
        queryKey: ['myEvents', user?.id],
        queryFn: () => fetchMyEvents(user!.id),
        enabled: !!user?.id,
    });

    const displayedEvents = events?.slice(0, 3) || [];

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Your Events</h2>
                <Button variant="link" asChild className="text-primary">
                    <Link href="/myposts">View All &gt;</Link>
                </Button>
            </div>
            <div className="space-y-4">
                 {isLoading && Array.from({ length: 2 }).map((_, index) => (
                    <Card key={index}>
                        <CardContent className="p-4 flex items-center gap-4">
                             <Skeleton className="w-20 h-20 rounded-lg" />
                             <div className="space-y-2 flex-grow">
                                <Skeleton className="h-4 w-1/4" />
                                <Skeleton className="h-6 w-3/4" />
                                <Skeleton className="h-4 w-1/2" />
                             </div>
                             <Skeleton className="h-10 w-24" />
                        </CardContent>
                    </Card>
                ))}

                {!isLoading && displayedEvents.map((event) => (
                    <Card key={event.id} className="overflow-hidden">
                        <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="bg-purple-100 dark:bg-purple-900/20 p-4 rounded-lg">
                                    <Drama className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                                </div>
                                <div className="flex-grow">
                                    <Badge variant={event.status === 'active' ? "secondary" : "outline"} className={event.status === 'active' ? "bg-blue-100 text-blue-800" : ""}>{event.status}</Badge>
                                    <h3 className="font-bold text-lg mt-1">{event.title}</h3>
                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground mt-1">
                                        <div className="flex items-center gap-1.5"><Calendar className="w-4 h-4"/><span>{new Date(event.schedule.startDate).toLocaleDateString()}</span></div>
                                        <div className="flex items-center gap-1.5"><MapPin className="w-4 h-4"/><span>{event.location.city}</span></div>
                                    </div>
                                    <p className="font-bold text-primary mt-2">${event.pricing.amount}/-</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
                                <Button variant="outline" size="sm">View Applicants ({event.currentRegistrations})</Button>
                                <Button variant="ghost" size="icon"><Edit className="w-4 h-4 text-muted-foreground"/></Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
                 {!isLoading && displayedEvents.length === 0 && (
                    <Card>
                        <CardContent className="p-6 text-center text-muted-foreground">
                            You haven't posted any events yet.
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}

