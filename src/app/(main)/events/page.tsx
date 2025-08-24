
"use client";

import { useQuery } from '@tanstack/react-query';
import { EventCard } from "./components/EventCard";
import { DiscoverSection } from "@/components/dashboard/DiscoverSection";
import { ProfileCompletionCard } from "@/components/dashboard/ProfileCompletionCard";
import { FilterBar } from "@/components/layout/FilterBar";
import type { GetGigsQuery } from "@/lib/types"; // Re-using for filter type
import { useCallback, useState } from 'react';
import { getEvents } from '@/lib/firebase/firestore'; // Assuming getEvents fetches all events for now
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const fetchEvents = async () => {
    const { data, error } = await getEvents();
    if (error) {
        throw new Error(error);
    }
    return data;
}

export default function EventsPage() {
    const [filters, setFilters] = useState<Partial<GetGigsQuery>>({});

     const { data: events, isLoading, isError } = useQuery({
        queryKey: ['events', filters], // Query key can include filters later
        queryFn: fetchEvents,
    });
    
    const handleFilterChange = useCallback((filterName: keyof GetGigsQuery, value: string) => {
        setFilters(prev => ({ ...prev, [filterName]: value }));
    }, []);

    const filteredEvents = events?.filter(event => {
        if (filters.search && !event.title.toLowerCase().includes(filters.search.toLowerCase())) {
            return false;
        }
        if (filters.category && event.category !== filters.category.toLowerCase()) {
            return false;
        }
         if (filters.location && !event.location?.city?.toLowerCase().includes(filters.location.toLowerCase())) {
            return false;
        }
        return true;
    });

  return (
    <div className="bg-muted/40 min-h-screen">
        <div className="container mx-auto py-10 relative">
            <DiscoverSection />
            <div className="mt-8">
                <FilterBar onFilterChange={handleFilterChange} searchPlaceholder="Search for events & workshops..." />
            </div>
            <div className="mt-8">
                 <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">{filteredEvents?.length ?? 0} Events Found</h2>
                </div>

                {isLoading && <p>Loading events...</p>}
                
                {isError && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>
                            There was a problem fetching events. Please try again later.
                        </AlertDescription>
                    </Alert>
                )}

                {!isLoading && !isError && filteredEvents?.length === 0 && (
                    <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>No Events Found</AlertTitle>
                        <AlertDescription>
                            There are no events matching your current filters. Try a different search.
                        </AlertDescription>
                    </Alert>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredEvents?.map((event) => (
                      <EventCard key={event.id} event={event} />
                    ))}
                </div>
            </div>
             <div className="absolute top-24 right-0 hidden xl:block">
                 <ProfileCompletionCard />
            </div>
        </div>
    </div>
  );
}
