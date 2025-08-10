
import { notFound } from "next/navigation";
import { getUserProfile_Admin } from "@/lib/firebase/admin-firestore";
import { ProfileHeader } from "./components/ProfileHeader";
import { ProfileTabs } from "./components/ProfileTabs";
import { Suspense } from "react";
import { ArtistProfileSkeleton } from "./components/skeletons/ArtistProfileSkeleton";

async function ArtistProfileContent({ artistId }: { artistId: string }) {
  // Use the admin version of the function for server-side rendering
  const { data: artist, error } = await getUserProfile_Admin(artistId);

  if (error || !artist) {
    console.error(`ArtistProfileContent: Failed to load profile for ${artistId}. Reason:`, error);
    notFound();
  }

  return (
    <>
      <ProfileHeader artist={artist} />
      <ProfileTabs artist={artist} />
    </>
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
