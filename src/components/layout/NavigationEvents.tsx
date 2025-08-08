
'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useLoaderStore } from '@/store/loaderStore';

export function NavigationEvents() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { setLoading } = useLoaderStore();
  const isInitialLoad = useRef(true);

  useEffect(() => {
    // Don't show loader on the very first load
    if (isInitialLoad.current) {
      isInitialLoad.current = false;
      return;
    }

    setLoading(true);

    // The setLoading(false) will be called in the cleanup function
    // of the *next* render, which happens when navigation completes.
    // However, if the component unmounts for any reason, we
    // also need to make sure the loader is turned off.
    return () => {
      setLoading(false);
    };
  }, [pathname, searchParams, setLoading]);

  return null;
}
