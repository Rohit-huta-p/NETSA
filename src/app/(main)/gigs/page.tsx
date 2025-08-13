
"use client";

import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { DiscoverSection } from "@/components/dashboard/DiscoverSection";
import type { Gig, GetGigsResponse } from "@/lib/types";
import { Skeleton } from '@/components/ui/skeleton';
import axios from 'axios';
import { auth } from '@/lib/firebase/config';
import { GigCard } from './components/GigCard';

function GigCardSkeleton() {
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


export default function GigsPage() {
  const [gigsResponse, setGigsResponse] = useState<GetGigsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const gigs = gigsResponse?.gigs || [];
  
  const fetchGigs = async () => {
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
      const response = await axios.get('/api/gigs', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setGigsResponse(response.data);
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
  };
  
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        fetchGigs();
      } else {
        setIsLoading(false);
        setGigsResponse(null);
        setError("Please log in to see available gigs.");
      }
    });

    return () => {
      unsubscribe();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-background font-body">
      <main className="p-4 sm:p-8">
        <DiscoverSection />
        <div className="mt-8">
          <div className="mb-6">
             <h2 className="text-2xl font-bold text-foreground">
              {isLoading ? 'Searching for Gigs...' : `${gigsResponse?.total || 0} Gigs Found`}
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => <GigCardSkeleton key={i} />)
              ) : error ? (
                <div className="text-center py-16 text-destructive bg-destructive/10 rounded-lg col-span-full">
                  <h3 className="text-2xl font-bold">Error</h3>
                  <p className="mb-4">{error}</p>
                  <Button onClick={fetchGigs} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">Retry</Button>
                </div>
              ) : gigs.length > 0 ? (
                <>
                  {gigs.map((gig: Gig) => (
                    <GigCard 
                      key={gig.id || Math.random()} 
                      gig={gig}
                    />
                  ))}
                </>
              ) : (
                <div className="text-center py-16 text-muted-foreground border-2 border-dashed rounded-lg col-span-full">
                  <h3 className="text-2xl font-bold">No Gigs Available</h3>
                  <p>There are currently no gigs posted. Check back soon!</p>
                </div>
              )}
          </div>
          {!isLoading && gigs.length > 0 && (
            <div className="text-center mt-12">
                <Button variant="outline">Load More Gigs</Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
