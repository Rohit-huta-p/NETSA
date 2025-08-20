
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getUserProfile_Admin } from "@/lib/server/actions";
import { ProfileHeader } from "./components/ProfileHeader";
import { PortfolioGallery } from "./components/PortfolioGallery";
import { Experience } from "./components/Experience";
import { ReviewsList } from "./components/ReviewsList";
import { ArtistProfileSkeleton } from "./components/skeletons/ArtistProfileSkeleton";
import { AboutCard } from "./components/AboutCard";
import { ProfessionalInfoCard } from "./components/ProfessionalInfoCard";

async function ArtistProfileContent({ artistId }: { artistId: string }) {
  const { data: artist, error } = await getUserProfile_Admin(artistId);

  if (error || !artist) {
    console.error(`ArtistProfileContent: Failed to load profile for ${artistId}. Reason:`, error);
    notFound();
  }

  return (
    <div className="space-y-8">
      <ProfileHeader artist={artist} />
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <AboutCard artist={artist} />
           {artist.role === 'artist' && <ProfessionalInfoCard artist={artist} />}
        </div>
        <div className="lg:col-span-3 space-y-4">
          <PortfolioGallery />
          <Experience />
          <ReviewsList />
        </div>
      </div>
    </div>
  )
}

export default async function ArtistProfilePage({ params }: { params: { id:string } }) {
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
