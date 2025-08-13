
"use client";

import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { DiscoverSection } from "@/components/dashboard/DiscoverSection";
import { EventCard } from "./components/EventCard";
import { ProfileCompletionCard } from "@/components/dashboard/ProfileCompletionCard";
import { getEvents } from "@/lib/firebase/firestore";
import type { Event } from "@/lib/types";
import { format } from "date-fns";
import { Skeleton } from '@/components/ui/skeleton';

// A simple mapping for tag colors based on event category.
const tagColorMap: { [key: string]: string } = {
  performance: "bg-red-200 text-red-800",
  competition: "bg-orange-200 text-orange-800",
  masterclass: "bg-blue-200 text-blue-800",
  audition: "bg-yellow-200 text-yellow-800",
  showcase: "bg-green-200 text-green-800",
  networking: "bg-indigo-200 text-indigo-800",
  festival: "bg-pink-200 text-pink-800",
  workshop: "bg-purple-200 text-purple-800", // A common one
};


function EventCardSkeleton() {
  return (
    <div className="bg-card rounded-2xl overflow-hidden shadow-md border">
      <Skeleton className="h-56 w-full" />
      <div className="p-5">
        <Skeleton className="h-6 w-3/4 mb-4" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-5/6 mb-4" />
        <div className="space-y-3 border-t pt-4">
          <Skeleton className="h-5 w-1/2" />
          <Skeleton className="h-5 w-2/3" />
          <Skeleton className="h-5 w-1/3" />
        </div>
      </div>
      <div className="p-5 border-t mt-auto flex justify-between items-center bg-muted/30">
        <Skeleton className="h-8 w-1/4" />
        <Skeleton className="h-10 w-1/3 rounded-md" />
      </div>
    </div>
  );
}
  
export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await getEvents();
      if (fetchError) {
        if (fetchError.includes('permission-denied') || fetchError.includes('insufficient permissions')) {
          setError("You don't have permission to view these events. Please check your Firestore security rules.");
        } else {
          setError("Failed to load events. Please try again later.");
        }
      } else {
        setEvents(data);
      }
    } catch (e: any) {
        setError("An unexpected error occurred. Please try again.");
        console.error(e);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div className=" min-h-screen bg-background font-body ">
      <main className="p-8 relative">
        <DiscoverSection />
        <div className="mt-8 relative">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-foreground">
              {isLoading ? 'Searching for Events...' : `${events.length} Events Found`}
            </h2>
          </div>
          <div className="relative">
            {isLoading ? (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {Array.from({ length: 3 }).map((_, i) => <EventCardSkeleton key={i} />)}
              </div>
            ) : error ? (
              <div className="text-center py-16 text-destructive bg-destructive/10 rounded-lg">
                <h3 className="text-2xl font-bold">Error</h3>
                <p className="mb-4">{error}</p>
                <Button onClick={fetchEvents} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">Retry</Button>
              </div>
            ) : events.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {events.map((event: Event) => (
                  <EventCard 
                    key={event.id} 
                    id={event.id}
                    tag={event.category}
                    tagColor={tagColorMap[event.category] || "bg-gray-200 text-gray-800"}
                    title={event.title}
                    description={event.description}
                    date={event.schedule?.startDate ? format(new Date(event.schedule.startDate), "MMM dd, yyyy") : 'Date TBD'}
                    location={event.location ? `${event.location.city}, ${event.location.country}` : 'Location TBD'}
                    attendees={event.currentRegistrations || 0}
                    price={event.pricing?.amount ?? null}
                    image={event.thumbnailUrl || "https://placehold.co/600x400.png"}
                    imageHint={"event opportunity"}
                  />
                ))}
              </div>
            ) : (
               <div className="text-center py-16 text-muted-foreground border-2 border-dashed rounded-lg">
                <h3 className="text-2xl font-bold">No Events Available</h3>
                <p>There are currently no events posted. Check back soon or create one!</p>
              </div>
            )}
          </div>
          <div className="text-center mt-12">
            <Button className="bg-gradient-to-r from-purple-500 to-orange-500 text-white px-8 py-3 rounded-full font-bold">Load More Events</Button>
          </div>
          <div className="absolute bottom-0  right-2 z-50 lg:block">
            <ProfileCompletionCard />
          </div>
        </div>
      </main>
    </div>
  );
}
