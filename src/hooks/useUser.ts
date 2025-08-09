
'use client';

import { useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import Cookies from 'js-cookie';
import { auth } from '@/lib/firebase/config';
import { getUserProfile } from '@/lib/firebase/firestore';
import { useUserStore } from '@/store/userStore';

export function useUser() {
    const { user, setUser, loading, setLoading, clearUser } = useUserStore();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (authUser: User | null) => {
            if (authUser) {
                // If we have an authenticated user but no profile in the zustand store,
                // it means the user was likely already logged in from a previous session.
                // We'll fetch their profile and populate the store.
                if (!user || user.uid !== authUser.uid) {
                    const token = await authUser.getIdToken();
                    Cookies.set('user-token', token, { expires: 1 }); // Refresh cookie
                    const { data, error } = await getUserProfile(authUser.uid);
                    
                    if (data) {
                        setUser({
                            ...authUser,
                            ...data,
                        });
                    } else {
                        // Handle case where user exists in Firebase Auth but not in Firestore.
                        // This can happen if profile creation failed.
                        // Instead of logging an error, we'll clear the session.
                        clearUser();
                        Cookies.remove('user-token');
                    }
                }
            } else {
                // No authenticated user found in Firebase Auth.
                clearUser();
                Cookies.remove('user-token');
            }
            setLoading(false);
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    // This effect should only run once on mount to set up the listener.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return { user, loading };
}
