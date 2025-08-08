
'use client';

import { useLoaderStore } from '@/store/loaderStore';
import { cn } from '@/lib/utils';

export function PageLoader() {
  const { isLoading } = useLoaderStore();

  return (
    <div
      className={cn(
        'h-1 w-full bg-transparent transition-opacity duration-300',
        isLoading ? 'opacity-100' : 'opacity-0'
      )}
    >
      {isLoading && (
        <div className="relative h-full w-full overflow-hidden bg-primary/20">
          <div className="absolute h-full w-full animate-loader-progress bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400"></div>
        </div>
      )}
    </div>
  );
}
