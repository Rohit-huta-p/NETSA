
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getUserProfile_Admin } from "@/lib/server/actions";
import { ProfileHeader } from "./components/ProfileHeader";
import { PortfolioGallery } from "./components/PortfolioGallery";
import { ActivityFeed } from "./components/ActivityFeed";
import { EventsList } from "./components/EventsList";
import { ReviewsList } from "./components/ReviewsList";
import { ArtistProfileSkeleton } from "./components/skeletons/ArtistProfileSkeleton";
import { Separator } from "@/components/ui/separator";

async function ArtistProfileContent({ artistId }: { artistId: string }) {
  const { data: artist, error } = await getUserProfile_Admin(artistId);

  if (error || !artist) {
    console.error(`ArtistProfileContent: Failed to load profile for ${artistId}. Reason:`, error);
    notFound();
  }

  return (
    <div className="space-y-8">
      <ProfileHeader artist={artist} />
      <div className="space-y-8">
        <PortfolioGallery />
        <ActivityFeed />
        <EventsList />
        <ReviewsList />
      </div>
    </div>
  )
}

export default async function ArtistProfilePage({ params }: { params: { id: string } }) {
  const { id } = params;

  if (!id) {
    notFound();
  }

  return (
    <div className="container mx-auto py-10">
      <Suspense fallback={<ArtistProfileSkeleton />}>
        <ArtistProfileContent artistId={id} />
      </Suspense>
    </div>
  );
}
