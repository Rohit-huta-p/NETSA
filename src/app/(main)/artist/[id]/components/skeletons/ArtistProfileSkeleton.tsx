

import { ProfileHeaderSkeleton } from "./ProfileHeaderSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

export function ArtistProfileSkeleton() {
  return (
    <div className="space-y-8">
      <ProfileHeaderSkeleton />
      <Skeleton className="h-64 w-full" />
      <Skeleton className="h-48 w-full" />
      <Skeleton className="h-32 w-full" />
    </div>
  );
}
