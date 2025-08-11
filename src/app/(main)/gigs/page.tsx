
"use client";

import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { DiscoverSection } from "@/components/dashboard/DiscoverSection";
import { EventCard } from "@/components/dashboard/EventCard";
import type { Gig, GetGigsResponse } from "@/lib/types";
import { format } from "date-fns";
import { Skeleton } from '@/components/ui/skeleton';
import axios from 'axios';
import { auth } from '@/lib/firebase/config';
import { AnimatePresence, motion } from 'framer-motion';
import { GigDetailView } from './components/GigDetailView';
import { useIsMobile } from '@/hooks/use-mobile';
import { ArrowLeft } from 'lucide-react';

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
  const [gigsResponse, setGigsResponse] = useState<GetGigsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedGig, setSelectedGig] = useState<Gig | null>(null);
  const isMobile = useIsMobile();

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
      if (response.data?.gigs?.length > 0) {
        setSelectedGig(response.data.gigs[0]);
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

  const handleSelectGig = (gig: Gig) => {
    setSelectedGig(gig);
  }

  const showBackButton = isMobile && selectedGig;
  
  return (
    <div className="min-h-screen bg-background font-body">
      <main className="p-4 sm:p-8">
        <DiscoverSection />
        <div className="mt-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              {showBackButton ? (
                <Button variant="ghost" onClick={() => setSelectedGig(null)}>
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back to List
                </Button>
              ) : (
                 <h2 className="text-2xl font-bold text-foreground">
                  {isLoading ? 'Searching for Gigs...' : `${gigsResponse?.total || 0} Gigs Found`}
                </h2>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-5 lg:gap-8">
            {/* Gigs List */}
            <div className={`lg:col-span-2 space-y-6 ${isMobile && selectedGig ? 'hidden' : 'block'}`}>
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
                    <EventCard 
                      key={gig.id || Math.random()} 
                      id={gig.id}
                      type="gig"
                      tag={gig.type}
                      tagColor={tagColorMap[gig.type] || "bg-gray-200 text-gray-800"}
                      title={gig.title || 'Untitled Gig'}
                      description={gig.description}
                      date={gig.startDate ? format(new Date(gig.startDate), "MMM dd, yyyy") : 'Date TBD'}
                      location={gig.location ? `${gig.location.city}, ${gig.location.country}` : 'Location TBD'}
                      attendees={gig.applications || 0}
                      price={gig.compensation?.amount ?? null}
                      image={"https://placehold.co/600x400.png"}
                      imageHint={"gig opportunity"}
                      onClick={() => handleSelectGig(gig)}
                      isActive={selectedGig?.id === gig.id}
                    />
                  ))}
                   <div className="text-center mt-6">
                        <Button variant="outline">Load More Gigs</Button>
                    </div>
                </>
              ) : (
                <div className="text-center py-16 text-muted-foreground border-2 border-dashed rounded-lg col-span-full">
                  <h3 className="text-2xl font-bold">No Gigs Available</h3>
                  <p>There are currently no gigs posted. Check back soon!</p>
                </div>
              )}
            </div>

            {/* Gig Details */}
            <div className={`lg:col-span-3 ${isMobile && !selectedGig ? 'hidden' : 'block'}`}>
              <AnimatePresence>
                {selectedGig && (
                  <motion.div
                    key={selectedGig.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="sticky top-24"
                  >
                    <div className="bg-muted/40 h-[calc(100vh-8rem)] overflow-y-auto rounded-lg">
                      <GigDetailView gig={selectedGig} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
               {!selectedGig && !isLoading && (
                    <div className="hidden lg:flex items-center justify-center h-full text-muted-foreground sticky top-24">
                        <p>Select a gig to see the details.</p>
                    </div>
                )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

