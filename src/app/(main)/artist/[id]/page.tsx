
import { notFound } from "next/navigation";
import { getUserProfile } from "@/lib/firebase/firestore";
import { ProfileHeader } from "./components/ProfileHeader";
import { ProfileTabs } from "./components/ProfileTabs";
import { Suspense } from "react";
import { ArtistProfileSkeleton } from "./components/skeletons/ArtistProfileSkeleton";

async function ArtistProfileContent({ artistId }: { artistId: string }) {
  const { data: artist, error } = await getUserProfile(artistId);

  if (error || !artist) {
    console.error(error);
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
  const { id } = params;

  return (
    <div className="container mx-auto py-10">
      <Suspense fallback={<ArtistProfileSkeleton />}>
        <ArtistProfileContent artistId={id} />
      </Suspense>
    </div>
  );
}
