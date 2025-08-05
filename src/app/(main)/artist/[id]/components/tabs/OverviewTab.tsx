
import { UserProfile } from "@/store/userStore";
import { ActivityFeed } from "../ActivityFeed";

interface OverviewTabProps {
  artist: UserProfile;
}
export function OverviewTab({ artist }: OverviewTabProps) {
  return (
    <ActivityFeed />
  );
}
