
'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useLoaderStore } from '@/store/loaderStore';

export function NavigationEvents() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { setLoading } = useLoaderStore();

  useEffect(() => {
    // On the initial load, we don't want to show a loader.
    // We only want to show it on subsequent navigations.
    // The hook will be mounted once and then the path will change.
    const handleStart = () => setLoading(true);
    const handleComplete = () => setLoading(false);
    
    // We'll use a timeout to avoid a flicker on very fast navigations.
    let timer: NodeJS.Timeout;

    const startLoading = () => {
      timer = setTimeout(() => {
        handleStart();
      }, 100); 
    };

    const stopLoading = () => {
      clearTimeout(timer);
      handleComplete();
    };

    // This is a stand-in for router events.
    // We can't use router.events in App router, so we watch pathname.
    // The effect will re-run when the pathname changes.
    // We'll treat the start of the effect as the "start" of navigation for this purpose.
    startLoading();

    // The cleanup function of useEffect will run when the component unmounts
    // or before it re-runs, which is perfect for our "complete" event.
    return () => {
      stopLoading();
    };
    
  }, [pathname, searchParams, setLoading]);

  return null;
}
