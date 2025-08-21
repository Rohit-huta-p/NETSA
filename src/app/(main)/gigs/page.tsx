
"use client";

import { useEffect, useState, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import type { Gig, GetGigsResponse, GetGigsQuery } from "@/lib/types";
import { Skeleton } from '@/components/ui/skeleton';
import axios from 'axios';
import { auth } from '@/lib/firebase/config';
import { GigCard } from './components/GigCard';
import { GigDetailView } from './components/GigDetailView';
import { Card, CardContent } from '@/components/ui/card';
import { GigCardSkeleton } from './components/skeletons/GigCardSkeleton';
import { useDebounce } from '@/hooks/use-debounce';
import { Briefcase } from 'lucide-react';
import { FilterBar } from '@/components/layout/FilterBar';

function GigsPageSkeleton() {
  return (
    <>
      <div className="lg:col-span-1 space-y-4">
        {Array.from({ length: 7 }).map((_, i) => (
            <GigCardSkeleton key={i} />
        ))}
      </div>
      <div className="lg:col-span-2 hidden lg:block">
        <Card>
            <CardContent className="p-6">
                <Skeleton className="h-8 w-3/4 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-5/6 mb-4" />
                 <div className="space-y-3 border-t pt-4 mt-4">
                    <Skeleton className="h-5 w-1/2" />
                    <Skeleton className="h-5 w-2/3" />
                    <Skeleton className="h-5 w-1/3" />
                </div>
            </CardContent>
        </Card>
      </div>
    </>
  );
}


export default function GigsPage() {
  const [gigsResponse, setGigsResponse] = useState<GetGigsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedGig, setSelectedGig] = useState<Gig | null>(null);
  const [filters, setFilters] = useState<Partial<GetGigsQuery>>({
    search: '',
    category: '',
  });

  const debouncedSearch = useDebounce(filters.search, 300);

  const gigs = gigsResponse?.gigs || [];
  
  const fetchGigs = useCallback(async (currentFilters: Partial<GetGigsQuery>) => {
    setIsLoading(true);
    setError(null);
    try {
      const user = auth.currentUser;
      if (!user) {
        setError("You must be logged in to view gigs.");
        setIsLoading(false);
        return;
      }
      const token = await user.getIdToken();

      const params = new URLSearchParams();
      if (currentFilters.search) params.append('search', currentFilters.search);
      if (currentFilters.category) params.append('category', currentFilters.category);

      const response = await axios.get(`/api/gigs?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setGigsResponse(response.data);
      if (response.data.gigs.length > 0) {
        setSelectedGig(response.data.gigs[0]);
      } else {
        setSelectedGig(null);
      }
    } catch (e: any) {
        if (e.response?.data?.message.includes('permission-denied') || e.response?.data?.message.includes('insufficient permissions')) {
          setError("You don't have permission to view these gigs. Please check your Firestore security rules.");
        } else {
            setError(e.response?.data?.message || "Failed to load gigs. Please try again later.");
        }
        console.error("gigs/page.tsx: Error fetching gigs:", e);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        fetchGigs({ search: debouncedSearch, category: filters.category });
      } else {
        setIsLoading(false);
        setGigsResponse(null);
        setError("Please log in to see available gigs.");
      }
    });

    return () => {
      unsubscribe();
    };
  }, [debouncedSearch, filters.category, fetchGigs]);

  const handleFilterChange = (filterName: keyof GetGigsQuery, value: string) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
  }

  return (
    <div className="min-h-screen bg-muted/40">
      <main className="container mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            Find Your Next <span className="text-primary">Gig</span>
          </h1>
          <p className="mt-3 text-lg max-w-2xl mx-auto text-muted-foreground">
            Browse thousands of opportunities from top organizers and brands.
          </p>
        </div>

        <FilterBar 
            onFilterChange={handleFilterChange} 
            searchPlaceholder="Search by title, skill, or company..."
        />
        
        <div className="mt-8">
          <div className="mb-4">
            <h2 className="text-xl font-bold">
              {isLoading ? 'Searching...' : `${gigsResponse?.total || 0} Gigs Found`}
            </h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              {isLoading ? (
                <GigsPageSkeleton />
              ) : error ? (
                <div className="text-center py-10 text-red-500 col-span-full">
                  <p>{error}</p>
                  <Button onClick={() => fetchGigs(filters)} className="mt-4">Retry</Button>
                </div>
              ) : gigs.length > 0 ? (
                <>
                  <div className="lg:col-span-1 space-y-4 h-[calc(100vh-22rem)] overflow-y-auto pr-2 -mr-2">
                    {gigs.map((gig: Gig) => (
                        <GigCard 
                            key={gig.id || Math.random()} 
                            gig={gig}
                            onClick={() => setSelectedGig(gig)}
                            isActive={selectedGig?.id === gig.id}
                        />
                    ))}
                  </div>
                  <div className="lg:col-span-2 hidden lg:block">
                    {selectedGig && (
                      <div className="sticky top-24">
                        <GigDetailView gig={selectedGig} />
                      </div>
                    )}
                     {!selectedGig && (
                        <div className="h-full flex flex-col items-center justify-center bg-card rounded-lg">
                            <Briefcase className="w-16 h-16 text-muted-foreground/50"/>
                            <p className="mt-4 text-muted-foreground">Select a gig to see details</p>
                        </div>
                     )}
                  </div>
                </>
              ) : (
                <div className="text-center py-10 text-muted-foreground col-span-full">
                  <p>No gigs found matching your criteria.</p>
                </div>
              )}
          </div>
        </div>
      </main>
    </div>
  );
}
