
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export function ProfileTabsSkeleton() {
  return (
    <div className="mt-8">
      <Skeleton className="h-12 w-full" />
      <div className="mt-6 space-y-8">
        <Card>
            <CardContent className="p-6 space-y-4">
                 <div className="text-center text-muted-foreground p-8 border-2 border-dashed rounded-lg">
                    <Skeleton className="h-6 w-48 mx-auto" />
                </div>
            </CardContent>
        </Card>
        <Card>
            <CardContent className="p-6 space-y-4">
                {Array.from({length: 3}).map((_, i) => (
                    <Card key={i} className="p-4 shadow-sm">
                        <div className="flex justify-between items-start">
                            <div>
                                <Skeleton className="h-5 w-40 mb-2" />
                                <Skeleton className="h-4 w-24" />
                            </div>
                            <div className="flex items-center gap-4 mt-1">
                                <Skeleton className="h-5 w-20" />
                                <Skeleton className="h-5 w-20" />
                            </div>
                        </div>
                    </Card>
                ))}
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
