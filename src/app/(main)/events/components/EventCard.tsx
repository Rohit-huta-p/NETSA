
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Clock, MapPin, Users, Heart, Drama } from "lucide-react";
import Link from "next/link";
import type { Event } from "@/lib/types";
import { format } from 'date-fns';

interface EventCardProps {
    event: Event;
}

export function EventCard({ event }: EventCardProps) {
    const href = `/events/${event.id}`;
    
    // A simple mapping for tag colors based on event category.
    const tagColorMap: { [key: string]: string } = {
        performance: "bg-pink-200 text-pink-800",
        competition: "bg-orange-200 text-orange-800",
        masterclass: "bg-blue-200 text-blue-800",
        workshop: "bg-purple-200 text-purple-800",
        audition: "bg-yellow-200 text-yellow-800",
        showcase: "bg-green-200 text-green-800",
        networking: "bg-indigo-200 text-indigo-800",
        festival: "bg-teal-200 text-teal-800",
    };
    
    return (
        <Link href={href} className="group block">
            <div className="bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full border">
                <div className="relative h-48 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/10 dark:to-pink-900/10 flex items-center justify-center">
                     <Drama className="w-16 h-16 text-purple-300/80 dark:text-purple-400/30" />
                    <span className={`absolute top-3 left-3 px-3 py-1 text-xs font-semibold rounded-full ${tagColorMap[event.category] || 'bg-gray-200 text-gray-800'}`}>
                        {event.category}
                    </span>
                     <div className="absolute top-3 right-3 bg-white/50 dark:bg-black/20 p-1.5 rounded-full">
                        <Heart className="w-5 h-5 text-red-500/80"/>
                    </div>
                     <div className="absolute bottom-3 right-3 bg-white/80 dark:bg-black/50 text-foreground font-bold px-3 py-1 rounded-full text-sm">
                        {event.pricing?.amount && event.pricing.amount > 0 ? `$${event.pricing.amount}` : "Free"}
                     </div>
                </div>
                <div className="p-5 flex-grow flex flex-col">
                    <h3 className="text-xl font-bold mb-2 truncate">{event.title}</h3>
                    <p className="text-muted-foreground text-sm mb-4 flex-grow line-clamp-2">{event.description}</p>
                    <div className="space-y-2.5 text-sm text-muted-foreground">
                        <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-2.5 text-primary/70" />
                            <span>{event.schedule?.startDate ? format(new Date(event.schedule.startDate), "MMM dd, yyyy - p") : 'Date TBD'}</span>
                        </div>
                        <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-2.5 text-primary/70" />
                            <span>{event.location ? `${event.location.city}, ${event.location.country}` : 'Location TBD'}</span>
                        </div>
                         <div className="flex items-center">
                            <Users className="w-4 h-4 mr-2.5 text-primary/70" />
                            <span>{event.currentRegistrations || 0} Attending</span>
                        </div>
                    </div>
                </div>
                <div className="p-4 border-t mt-auto">
                    <Button className="w-full font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90 transition-opacity">
                        Join Event
                    </Button>
                </div>
            </div>
        </Link>
    );
  }
