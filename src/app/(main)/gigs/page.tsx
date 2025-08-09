
import { Button } from "@/components/ui/button";
import { DiscoverSection } from "@/components/dashboard/DiscoverSection";
import { EventCard } from "@/components/dashboard/EventCard";
import { ProfileCompletionCard } from "@/components/dashboard/ProfileCompletionCard";
import { getGigs } from "@/lib/firebase/firestore";
import type { Gig } from "@/lib/types";
import { format } from "date-fns";

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

export default async function GigsPage() {
  const { data: gigs, error } = await getGigs();

  if (error) {
    return <div className="text-center p-8">Failed to load gigs. Please try again later.</div>
  }

  return (
    <div className=" min-h-screen bg-background font-body ">
      <main className="p-8 relative">
        <DiscoverSection />
        <div className="mt-8 relative">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-foreground">{gigs.length} Gigs Found</h2>
            </div>
            <div className="relative">
              {gigs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {gigs.map((gig: Gig) => (
                    <EventCard 
                      key={gig.id} 
                      tag={gig.type}
                      tagColor={tagColorMap[gig.type] || "bg-gray-200 text-gray-800"}
                      title={gig.title}
                      description={gig.description}
                      date={gig.startDate ? format(new Date(gig.startDate), "MMM dd, yyyy") : 'Date TBD'}
                      location={`${gig.location.city}, ${gig.location.country}`}
                      attendees={gig.currentApplications}
                      price={gig.compensation?.amount ?? null}
                      image={"https://placehold.co/600x400.png"} // Default placeholder
                      imageHint={"gig opportunity"}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 text-muted-foreground">
                  <h3 className="text-2xl font-bold">No Gigs Found</h3>
                  <p>There are currently no gigs posted. Check back soon!</p>
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
