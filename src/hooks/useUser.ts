
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
                if (!user) { // Only fetch if user is not already in the store
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
    }, [user, setUser, setLoading, clearUser]);

    return { user, loading };
}
