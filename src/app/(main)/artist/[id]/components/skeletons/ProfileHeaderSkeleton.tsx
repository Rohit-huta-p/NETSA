
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export function ProfileHeaderSkeleton() {
  return (
    <div className="bg-card p-8 rounded-2xl shadow-lg relative border">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="relative w-32 h-32 md:w-40 md:h-40 flex-shrink-0">
          <Skeleton className="w-full h-full rounded-full" />
        </div>
        <div className="flex-grow mt-4 md:mt-0">
          <div className="flex items-start justify-between">
            <div>
              <Skeleton className="h-10 w-64 mb-2" />
              <Skeleton className="h-5 w-48" />
              <div className="mt-4 space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            </div>
            <Skeleton className="h-10 w-32" />
          </div>
          
          <div className="mt-6">
            <Skeleton className="h-5 w-24 mb-3" />
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-6 w-24 rounded-full" />
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-28 rounded-full" />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-8 pt-8 border-t">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {Array.from({length: 4}).map((_, i) => (
                <div key={i} className="flex flex-col items-center">
                    <Skeleton className="h-8 w-16 mb-2" />
                    <Skeleton className="h-4 w-24" />
                </div>
            ))}
        </div>
      </div>
    </div>
  );
}
