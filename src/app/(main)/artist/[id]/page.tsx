

import { notFound } from "next/navigation";
import { getUserProfile_Admin } from "@/lib/server/actions";
import { ProfileHeader } from "./components/ProfileHeader";
import { Suspense } from "react";
import { ArtistProfileSkeleton } from "./components/skeletons/ArtistProfileSkeleton";
import { PortfolioGallery } from "./components/PortfolioGallery";
import { ActivityFeed } from "./components/ActivityFeed";
import { EventsList } from "./components/EventsList";
import { Testimonials } from "./components/Testimonials";

async function ArtistProfileContent({ artistId }: { artistId: string }) {
  // Use the admin version of the function for server-side rendering
  const { data: artist, error } = await getUserProfile_Admin(artistId);

  if (error || !artist) {
    console.error(`ArtistProfileContent: Failed to load profile for ${artistId}. Reason:`, error);
    notFound();
  }

  return (
    <div className="space-y-8">
      <ProfileHeader artist={artist} />
      <PortfolioGallery />
      <ActivityFeed />
      <EventsList />
      <Testimonials />
    </div>
  )
}

export default async function ArtistProfilePage({ params }: { params: { id: string } }) {
  const awaitedParams = await params;
  const { id } = awaitedParams;

  return (
    <div className="container mx-auto py-10">
      <Suspense fallback={<ArtistProfileSkeleton />}>
        <ArtistProfileContent artistId={id} />
      </Suspense>
    </div>
  );
}
