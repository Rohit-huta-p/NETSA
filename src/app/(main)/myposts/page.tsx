
"use client";

import { useQuery } from '@tanstack/react-query';
import { EventCard } from "@/app/(main)/events/components/EventCard";
import { GigCard } from '@/app/(main)/gigs/components/GigCard';
import { FilterBar } from "@/components/layout/FilterBar";
import type { GetGigsQuery } from "@/lib/types";
import { useCallback, useState } from 'react';
import { getEvents, getMyGigs } from '@/lib/firebase/firestore';
import { useUser } from '@/hooks/useUser';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const fetchMyPosts = async (userId: string) => {
    const [{ data: events, error: eventsError }, { data: gigs, error: gigsError }] = await Promise.all([
        getEvents(userId),
        getMyGigs(userId)
    ]);
    if (eventsError || gigsError) {
        throw new Error(eventsError || gigsError || 'Failed to fetch posts');
    }
    return { events, gigs };
}

export default function MyPostsPage() {
    const { user } = useUser();
    const [filters, setFilters] = useState<Partial<GetGigsQuery>>({});

     const { data: posts, isLoading, isError } = useQuery({
        queryKey: ['myPosts', user?.id, filters],
        queryFn: () => fetchMyPosts(user!.id),
        enabled: !!user?.id
    });
    
    const handleFilterChange = useCallback((filterName: keyof GetGigsQuery, value: string) => {
        setFilters(prev => ({ ...prev, [filterName]: value }));
    }, []);
    
    const applyFilters = (items: any[]) => {
        return items.filter(item => {
            if (filters.search && !item.title.toLowerCase().includes(filters.search.toLowerCase())) {
                return false;
            }
            if (filters.category && item.category !== filters.category.toLowerCase()) {
                return false;
            }
            if (filters.location && !item.location?.city?.toLowerCase().includes(filters.location.toLowerCase())) {
                return false;
            }
            return true;
        });
    }

    const filteredEvents = posts?.events ? applyFilters(posts.events) : [];
    const filteredGigs = posts?.gigs ? applyFilters(posts.gigs) : [];

  return (
    <div className="bg-muted/40 min-h-screen">
        <div className="container mx-auto py-10">
            <div className="text-center mb-8">
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                    Your <span className="text-primary">Posts</span>
                </h1>
                <p className="mt-3 text-lg max-w-2xl mx-auto text-muted-foreground">
                    Manage, edit, and view applicants for your gigs and events.
                </p>
            </div>

            <div className="mt-8">
                <FilterBar onFilterChange={handleFilterChange} searchPlaceholder="Search your posts..." />
            </div>
            
            <Tabs defaultValue="events" className="mt-8">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="events">Events ({filteredEvents.length})</TabsTrigger>
                    <TabsTrigger value="gigs">Gigs ({filteredGigs.length})</TabsTrigger>
                </TabsList>
                <TabsContent value="events">
                    <div className="mt-6">
                        {isLoading && <p>Loading events...</p>}
                        
                        {isError && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>Error</AlertTitle>
                                <AlertDescription>There was a problem fetching your events.</AlertDescription>
                            </Alert>
                        )}

                        {!isLoading && !isError && filteredEvents.length === 0 && (
                            <Alert>
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>No Events Found</AlertTitle>
                                <AlertDescription>You haven't created any events that match the current filters.</AlertDescription>
                            </Alert>
                        )}
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredEvents.map((event) => (
                              <EventCard key={event.id} event={event} />
                            ))}
                        </div>
                    </div>
                </TabsContent>
                <TabsContent value="gigs">
                    <div className="mt-6">
                        {isLoading && <p>Loading gigs...</p>}
                        
                        {isError && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>Error</AlertTitle>
                                <AlertDescription>There was a problem fetching your gigs.</AlertDescription>
                            </Alert>
                        )}

                        {!isLoading && !isError && filteredGigs.length === 0 && (
                            <Alert>
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>No Gigs Found</AlertTitle>
                                <AlertDescription>You haven't created any gigs that match the current filters.</AlertDescription>
                            </Alert>
                        )}
                        
                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredGigs.map((gig) => (
                              <GigCard key={gig.id} gig={gig} onClick={() => {}} />
                            ))}
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    </div>
  );
}
