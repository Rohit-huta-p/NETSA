
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getUserProfile_Admin } from "@/lib/server/actions";
import { ProfileHeader } from "./components/ProfileHeader";
import { PortfolioGallery } from "./components/PortfolioGallery";
import { Experience } from "./components/Experience";
import { ArtistProfileSkeleton } from "./components/skeletons/ArtistProfileSkeleton";
import { AboutCard } from "./components/AboutCard";
import { CardTitle } from "@/components/ui/card";

async function ArtistProfileContent({ artistId }: { artistId: string }) {
  const { data: profile, error } = await getUserProfile_Admin(artistId);

  if (error || !profile) {
    console.error(`ArtistProfileContent: Failed to load profile for ${artistId}. Reason:`, error);
    notFound();
  }

  return (
    <div className="space-y-8">
      <ProfileHeader artist={profile} />
     
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-1">
            <AboutCard artist={profile} />
          </div>
          <div className="lg:col-span-2 space-y-8">
            <PortfolioGallery />
            <div>
              <CardTitle className="text-xl font-bold mb-4">Experience</CardTitle>
              <Experience />
            </div>
          </div>
        </div>
      {profile.role === 'organizer' && (
        <div className="space-y-8">
           <div>
              <CardTitle className="text-xl font-bold mb-4">Experience</CardTitle>
              <Experience />
            </div>
        </div>
      )}
    </div>
  )
}

export default async function ArtistProfilePage({ params }: { params: { id:string } }) {
  const { id } = params;

  if (!id) {
    notFound();
  }

  return (
    <div className="bg-muted/30">
        <div className="container mx-auto py-10">
            <Suspense fallback={<ArtistProfileSkeleton />}>
                <ArtistProfileContent artistId={id} />
            </Suspense>
        </div>
    </div>
  );
}
