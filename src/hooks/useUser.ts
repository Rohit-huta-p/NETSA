
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
                const token = await authUser.getIdToken();
                Cookies.set('user-token', token, { expires: 1 }); // Expires in 1 day
                const { data } = await getUserProfile(authUser.uid);
                
                setUser({
                    ...authUser,
                    ...data,
                });
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
