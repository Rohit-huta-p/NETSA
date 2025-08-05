
import { getArtistProfile } from "@/lib/firebase/firestore";
import { ProfileHeader } from "./components/ProfileHeader";
import { ProfileTabs } from "./components/ProfileTabs";
import { notFound } from "next/navigation";

export default async function ArtistProfilePage({ params }: { params: { id: string } }) {
  const { data: artist, error } = await getArtistProfile(params.id);

  if (error || !artist) {
    console.error(error);
    notFound();
  }

  return (
    <div className="container mx-auto py-10">
      <ProfileHeader artist={artist} />
      <ProfileTabs artist={artist} />
    </div>
  );
}
