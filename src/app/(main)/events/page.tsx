
"use client";

import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { EventCard } from "./components/EventCard";
import { ProfileCompletionCard } from "@/components/dashboard/ProfileCompletionCard";
import { getEvents } from "@/lib/firebase/firestore";
import type { Event } from "@/lib/types";
import { Skeleton } from '@/components/ui/skeleton';
import { FilterBar } from '@/components/layout/FilterBar';
import { Drama, Flame, Sparkles } from 'lucide-react';
import { DiscoverSection } from '@/components/dashboard/DiscoverSection';

function EventCardSkeleton() {
  return (
    <div className="bg-card rounded-2xl overflow-hidden shadow-md border">
      <Skeleton className="h-48 w-full" />
      <div className="p-5">
        <Skeleton className="h-6 w-3/4 mb-4" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-5/6 mb-4" />
        <div className="space-y-3 border-t pt-4 mt-4">
          <Skeleton className="h-5 w-1/2" />
          <Skeleton className="h-5 w-2/3" />
        </div>
      </div>
      <div className="p-4 border-t mt-auto">
        <Skeleton className="h-10 w-full rounded-md" />
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
    <div className="min-h-screen bg-background font-body">
      <main className="container mx-auto py-8 px-4">
        <DiscoverSection />
        
        <FilterBar onFilterChange={() => {}} />

        <div className="mt-12 relative">
          <div className="flex justify-between items-center mb-6">
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
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            ) : (
               <div className="text-center py-16 text-muted-foreground border-2 border-dashed rounded-lg">
                <Drama className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-xl font-bold">No Events Available</h3>
                <p>There are currently no events posted. Check back soon or create one!</p>
              </div>
            )}
          </div>
          <div className="text-center mt-12">
            <Button size="lg" className="px-8 py-3 rounded-full font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90 transition-opacity">
              Load More Events
            </Button>
          </div>
          <div className="absolute bottom-0 right-0 z-50 hidden xl:block">
            <ProfileCompletionCard />
          </div>
        </div>
      </main>
    </div>
  );
}
