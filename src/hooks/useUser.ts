
'use client';

import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import Cookies from 'js-cookie';
import { auth } from '@/lib/firebase/config';
import { getUserProfile } from '@/lib/firebase/firestore';
import { useUserStore } from '@/store/userStore';

export function useUser() {
    const { user, setUser, loading, setLoading, clearUser } = useUserStore();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
            if (authUser) {
                // If we have an authenticated user but no profile in the store, fetch it.
                // This handles the case where the user is already logged in when they visit the site.
                if (!user || user.uid !== authUser.uid) {
                    const token = await authUser.getIdToken();
                    Cookies.set('user-token', token, { expires: 1 });
                    const { data } = await getUserProfile(authUser.uid);
                    
                    setUser({
                        ...authUser,
                        ...data,
                    });
                }
            } else {
                Cookies.remove('user-token');
                clearUser();
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [setUser, setLoading, clearUser]);

    return { user, loading };
}
