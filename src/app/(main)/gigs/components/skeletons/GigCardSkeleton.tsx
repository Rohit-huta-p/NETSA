
import { Skeleton } from "@/components/ui/skeleton";

export function GigCardSkeleton() {
  return (
    <div className="bg-card rounded-lg p-4 space-y-3 border">
      <div className="flex justify-between items-center mb-2">
        <Skeleton className="h-5 w-20 rounded-full" />
        <Skeleton className="h-4 w-12" />
      </div>
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />

      <div className="space-y-2 border-t pt-3 mt-3">
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-4 w-1/4" />
      </div>
    </div>
  );
}
