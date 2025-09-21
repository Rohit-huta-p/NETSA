
"use client";

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { GetGigsQuery, Gig } from '@/lib/types';
import { GigCard } from './components/GigCard';
import { GigDetailView } from './components/GigDetailView';
import { GigCardSkeleton } from './components/skeletons/GigCardSkeleton';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { FilterBar } from '@/components/layout/FilterBar';
import { useDebounce } from '@/hooks/use-debounce';
import axios from 'axios';
import { useUser } from '@/hooks/useUser';
import { useRouter } from 'next/navigation';
import { useIsMobile } from '@/hooks/use-mobile';
import { DiscoverSection } from '@/components/dashboard/DiscoverSection';
import { ProfileCompletionCard } from '@/components/dashboard/ProfileCompletionCard';
import { ScrollArea } from '@/components/ui/scroll-area';


const fetchGigs = async (filters: Partial<GetGigsQuery>, token: string | null) => {
    if (!token) {
        throw new Error("Authentication token not found.");
    }
    const { data } = await axios.get('/api/gigs', { 
        params: filters,
        headers: {
            'Authorization': `Bearer ${token}`
        }
     });
     console.log("GIGS fetched: ",data);
     
    return data;
};

export default function GigsPage() {
    const { user } = useUser();
    const router = useRouter();
    const isMobile = useIsMobile();
    const [selectedGig, setSelectedGig] = useState<Gig | null>(null);
    const [filters, setFilters] = useState<Partial<GetGigsQuery>>({});
    
    const debouncedSearch = useDebounce(filters.search, 500);

    const queryKey = useMemo(() => ['gigs', { ...filters, search: debouncedSearch }], [filters, debouncedSearch]);

    const { data: gigsResponse, isLoading, isError, error } = useQuery({
        queryKey: queryKey,
        queryFn: () => fetchGigs({ ...filters, search: debouncedSearch }, user?.token as string | null),
        enabled: !!user?.token,
    });
    
    const handleFilterChange = useCallback((filterName: keyof GetGigsQuery, value: string) => {
        setFilters(prev => ({ ...prev, [filterName]: value }));
    }, []);

    const handleGigClick = useCallback((gig: Gig) => {
        if (isMobile) {
            router.push(`/gigs/${gig.id}`);
        } else {
            setSelectedGig(gig);
        }
    }, [isMobile, router]);
    

    // Set the first gig as selected by default on desktop
    useEffect(() => {
        if (!isMobile && !selectedGig && gigsResponse?.gigs && gigsResponse.gigs.length > 0) {
            setSelectedGig(gigsResponse.gigs[0]);
        }
         if (gigsResponse?.gigs && gigsResponse.gigs.length === 0) {
            setSelectedGig(null);
        }
    }, [gigsResponse, selectedGig, isMobile]);

    return (
        <div className="bg-muted/40 relative flex flex-col p-5 min-h-screen">
             <div className="container mx-auto">
                <DiscoverSection />
                <div className="mt-8">
                     <FilterBar onFilterChange={handleFilterChange} searchPlaceholder="Search for gigs..." />
                </div>
            </div>

            {/* GIG LIST AND GIG DETAIL VIEW */}
            <div className="flex grid grid-cols-1 md:grid-cols-12 gap-8 items-start h-screen overflow-hidden mt-8">
                <div className="md:col-span-4 lg:col-span-3 h-full overflow-hidden">
                     <ScrollArea className="h-screen">
                        <div className="space-y-4">
                            {isLoading && Array.from({ length: 5 }).map((_, i) => <GigCardSkeleton key={i} />)}

                            {isError && (
                                    <Alert variant="destructive">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertTitle>Error</AlertTitle>
                                    <AlertDescription>
                                        There was a problem fetching gigs. Please try again later.
                                    </AlertDescription>
                                </Alert>
                            )}

                            {!isLoading && !isError && gigsResponse?.gigs.length === 0 && (
                                <Alert>
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertTitle>No Gigs Found</AlertTitle>
                                    <AlertDescription>
                                        There are no gigs matching your current filters. Try adjusting your search.
                                    </AlertDescription>
                                </Alert>
                            )}
                            
                            {!isLoading && !isError && gigsResponse?.gigs.map((gig: Gig) => (
                                <GigCard 
                                    key={gig.id} 
                                    gig={gig} 
                                    onClick={() => handleGigClick(gig)}
                                    isActive={selectedGig?.id === gig.id}
                                />
                            ))}
                        </div>
                     </ScrollArea>
                </div>

                <div className="md:col-span-8 lg:col-span-9 hidden md:block h-full overflow-hidden ">
                    <ScrollArea className="h-screen">
                        {selectedGig ? (
                            <GigDetailView gig={selectedGig} />
                        ) : (
                            !isLoading && (
                                <div className="flex items-center justify-center h-[60vh] bg-card rounded-lg border">
                                    <p className="text-muted-foreground">Select a gig to see the details</p>
                                </div>
                            )
                        )}
                        {isLoading && (
                            <div className="flex items-center justify-center h-[60vh] bg-card rounded-lg border">
                                    <p className="text-muted-foreground">Loading gig details...</p>
                            </div>
                        )}
                    </ScrollArea>
                </div>
            </div>
             <div className="absolute bottom-24 right-10 hidden xl:block">
                 <ProfileCompletionCard />
            </div>
        </div>
    );
}
