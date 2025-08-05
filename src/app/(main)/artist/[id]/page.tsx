import { ProfileHeader } from "./components/ProfileHeader";
import { ProfileTabs } from "./components/ProfileTabs";

export default function ArtistProfilePage({ params }: { params: { id: string } }) {
  // In a real app, you would fetch artist data based on params.id
  // const artist = await getArtistProfile(params.id);

  return (
    <div className="container mx-auto py-10">
      <ProfileHeader />
      <ProfileTabs />
    </div>
  );
}
