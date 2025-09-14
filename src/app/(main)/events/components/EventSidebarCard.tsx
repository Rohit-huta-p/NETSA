
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import type { Event } from "@/lib/types";
import { useUser } from "@/hooks/useUser";
import { Users } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface EventSidebarCardProps {
    event: Event;
}

export function EventSidebarCard({ event }: EventSidebarCardProps) {
    const { user } = useUser();
    
    const progress = event.maxParticipants ? (event.currentRegistrations / event.maxParticipants) * 100 : 0;
    const spotsRemaining = event.maxParticipants - event.currentRegistrations;

    // Dummy data for organizer view
    const totalApplications = 32;
    const pending = 8;
    const shortlisted = 1;
    const confirmed = 18;

    const isOrganizer = user?.role === 'organizer' && user?.id === event.organizerId;

    if (isOrganizer) {
        return (
            <Card className="shadow-lg rounded-xl border-2 border-primary/10">
                <CardContent className="p-6">
                    <p className="text-3xl font-bold text-center text-primary mb-1">₹{event.pricing.amount}/-</p>
                    <div className="flex justify-center items-center text-sm text-muted-foreground gap-2 mb-2">
                        <Users className="w-4 h-4" />
                        <span>{event.currentRegistrations} / {event.maxParticipants} registered</span>
                    </div>

                    <div className="mb-4">
                        <div className="flex justify-between items-center text-xs font-medium text-muted-foreground mb-1">
                            <p>Spots remaining:</p>
                            <p className="text-primary font-bold">{spotsRemaining}</p>
                        </div>
                        <Progress value={progress} className="h-2" />
                    </div>
                    
                    <p className="text-sm text-muted-foreground text-center">Total applications: {totalApplications}</p>

                    <Separator className="my-4" />

                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Pending</span>
                            <span className="font-bold text-orange-500">{pending}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Shortlisted</span>
                            <span className="font-bold text-blue-500">{shortlisted}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Confirmed</span>
                            <span className="font-bold text-green-500">{confirmed}</span>
                        </div>
                    </div>
                    
                    <Button size="lg" className="w-full font-bold text-lg bg-primary/10 hover:bg-primary/20 text-primary mt-4">
                        Review Applications
                    </Button>
                </CardContent>
            </Card>
        )
    }

    return (
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
    );
}
