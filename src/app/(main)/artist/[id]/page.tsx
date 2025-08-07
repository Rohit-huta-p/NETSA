
import { notFound } from "next/navigation";
import { getUserProfile } from "@/lib/firebase/firestore";
import { ProfileHeader } from "./components/ProfileHeader";
import { ProfileTabs } from "./components/ProfileTabs";
import { UserProfile } from "@/store/userStore";

export default async function ArtistProfilePage({ params }: { params: { id: string } }) {
  const { id } = params;
  
  const { data: artist, error } = await getUserProfile(id);

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
