
import { notFound } from "next/navigation";
import { getAdminUserProfile } from "@/lib/firebase/admin-config";
import { ProfileHeader } from "./components/ProfileHeader";
import { ProfileTabs } from "./components/ProfileTabs";
import { getUserProfileFromClient } from "@/lib/firebase/firestore";

export default async function ArtistProfilePage({ params }: { params: { id: string } }) {
  const { id } = params;
  console.log("IDD",id);
  
  const { data: artist, error } = await getUserProfileFromClient(id);

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
