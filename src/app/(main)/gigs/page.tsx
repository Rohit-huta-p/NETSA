
"use client";

import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { DiscoverSection } from "@/components/dashboard/DiscoverSection";
import { EventCard } from "@/components/dashboard/EventCard";
import { ProfileCompletionCard } from "@/components/dashboard/ProfileCompletionCard";
import { getGigs } from "@/lib/firebase/firestore";
import type { Gig } from "@/lib/types";
import { format } from "date-fns";
import { Skeleton } from '@/components/ui/skeleton';

// A simple mapping for tag colors based on gig type.
const tagColorMap: { [key: string]: string } = {
  performance: "bg-purple-200 text-purple-800",
  photoshoot: "bg-pink-200 text-pink-800",
  recording: "bg-blue-200 text-blue-800",
  event: "bg-green-200 text-green-800",
  audition: "bg-yellow-200 text-yellow-800",
  modeling: "bg-indigo-200 text-indigo-800",
  teaching: "bg-teal-200 text-teal-800",
  collaboration: "bg-gray-200 text-gray-800",
};

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
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOffline, setIsOffline] = useState(false);

  const fetchGigs = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await getGigs();
      if (fetchError) {
        // Specifically check for permission errors.
        if (fetchError.includes('permission-denied') || fetchError.includes('insufficient permissions')) {
             setError("You don't have permission to view these gigs. Please check your Firestore security rules.");
        } else {
            setError("Failed to load gigs. Please try again later.");
        }
      } else {
        setGigs(data);
      }
    } catch (e: any) {
        setError("An unexpected error occurred. Please try again.");
        console.error(e);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    // Client-side only check for offline status
    if (typeof window !== 'undefined' && 'onLine' in navigator) {
      setIsOffline(!navigator.onLine);
      const handleOnline = () => setIsOffline(false);
      const handleOffline = () => setIsOffline(true);
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);

      // Initial fetch
      fetchGigs();
      
      return () => {
          window.removeEventListener('online', handleOnline);
          window.removeEventListener('offline', handleOffline);
      };
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className=" min-h-screen bg-background font-body ">
      <main className="p-8 relative">
        <DiscoverSection />
        <div className="mt-8 relative">
          {isOffline && (
            <div className="text-center p-4 mb-4 bg-yellow-100 text-yellow-800 rounded-lg">
              You are offline. Showing cached or last loaded data.
            </div>
          )}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-foreground">
              {isLoading ? 'Searching for Gigs...' : `${gigs.length} Gigs Found`}
            </h2>
          </div>
          <div className="relative">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {Array.from({ length: 3 }).map((_, i) => <GigCardSkeleton key={i} />)}
              </div>
            ) : error ? (
              <div className="text-center py-16 text-destructive bg-destructive/10 rounded-lg">
                <h3 className="text-2xl font-bold">Error</h3>
                <p className="mb-4">{error}</p>
                <Button onClick={fetchGigs} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">Retry</Button>
              </div>
            ) : gigs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {gigs.map((gig: Gig) => (
                  <EventCard 
                    key={gig.id || Math.random()} 
                    id={gig.id}
                    tag={gig.type}
                    tagColor={tagColorMap[gig.type] || "bg-gray-200 text-gray-800"}
                    title={gig.title || 'Untitled Gig'}
                    description={gig.description}
                    date={gig.startDate ? format(new Date(gig.startDate), "MMM dd, yyyy") : 'Date TBD'}
                    location={gig.location ? `${gig.location.city}, ${gig.location.country}` : 'Location TBD'}
                    attendees={gig.applications || 0}
                    price={gig.compensation?.amount ?? null}
                    image={"https://placehold.co/600x400.png"} // Default placeholder
                    imageHint={"gig opportunity"}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 text-muted-foreground border-2 border-dashed rounded-lg">
                <h3 className="text-2xl font-bold">No Gigs Available</h3>
                <p>There are currently no gigs posted. Check back soon or create one!</p>
              </div>
            )}
          </div>
          <div className="text-center mt-12">
            <Button className="bg-gradient-to-r from-purple-500 to-orange-500 text-white px-8 py-3 rounded-full font-bold">Load More Gigs</Button>
          </div>
          <div className="absolute bottom-0  right-2 z-50 lg:block">
            <ProfileCompletionCard />
          </div>
        </div>
      </main>
    </div>
  );
}
