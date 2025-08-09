
'use client';

import { useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import Cookies from 'js-cookie';
import { auth } from '@/lib/firebase/config';
import { getUserProfile } from '@/lib/firebase/firestore';
import { useUserStore } from '@/store/userStore';
import { Timestamp } from 'firebase/firestore';

// Helper function to convert Firestore Timestamps to Date objects
const convertTimestamps = (data: any): any => {
    if (!data) return data;
    const newData: { [key: string]: any } = {};
    for (const key in data) {
        if (data[key] instanceof Timestamp) {
            newData[key] = data[key].toDate();
        } else if (typeof data[key] === 'object' && data[key] !== null && !Array.isArray(data[key]) && !(data[key] instanceof Date)) {
            newData[key] = convertTimestamps(data[key]);
        }
        else {
            newData[key] = data[key];
        }
    }
    return newData;
};

export function useUser() {
    const { user, setUser, loading, setLoading, clearUser } = useUserStore();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (authUser: User | null) => {
            if (authUser) {
                if (!user || user.uid !== authUser.uid) {
                    const token = await authUser.getIdToken();
                    Cookies.set('user-token', token, { expires: 1 });
                    const { data, error } = await getUserProfile(authUser.uid);
                    
                    if (data) {
                        const serializableData = convertTimestamps(data);
                        setUser({
                            ...authUser,
                            ...serializableData,
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
                clearUser();
                Cookies.remove('user-token');
            }
            setLoading(false);
        });

        return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return { user, loading };
}
