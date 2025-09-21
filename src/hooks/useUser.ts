
'use client';

import { useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import Cookies from 'js-cookie';
import { auth } from '@/lib/firebase/config';
import { getUserProfile, addUserProfile } from '@/lib/firebase/firestore';
import { useUserStore } from '@/store/userStore';
import { Timestamp } from 'firebase/firestore';
import { useToast } from './use-toast';

// Helper function to convert Firestore Timestamps to Date objects
const convertTimestamps = (data: any): any => {
    if (!data) return data;
    const newData: { [key: string]: any } = {};
    for (const key in data) {
        if (data[key] instanceof Timestamp) {
            newData[key] = data[key].toDate();
        } else if (typeof data[key] === 'object' && data[key] !== null && !Array.isArray(data[key])) {
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
    const { toast } = useToast();

    useEffect(() => {
        console.log("useUser.ts: useEffect triggered. Setting up onAuthStateChanged listener.");
        const unsubscribe = onAuthStateChanged(auth, async (authUser: User | null) => {
            if (authUser) {
                console.log("useUser.ts: onAuthStateChanged - User is authenticated with UID:", authUser.uid);
                // Only re-fetch if the user in state is not the same as the auth user
                if (!user || user.id !== authUser.uid) {
                    console.log("useUser.ts: App state user is stale or different. Fetching profile for UID:", authUser.uid);
                    setLoading(true);
                    const token = await authUser.getIdToken();
                    Cookies.set('user-token', token, { expires: 1 });
                    
                    let { data, error } = await getUserProfile(authUser.uid);
                    
                    if (error || !data) {
                        console.warn("useUser.ts: User profile not found for UID:", authUser.uid, "Attempting to recover by creating a default profile.");
                        toast({
                            title: 'Setting up your profile...',
                            description: "We couldn't find a profile for your account, so we're creating one now.",
                        });

                        const now = new Date();
                        const [firstName, lastName] = authUser.email?.split('@')[0].split('.') || ['New', 'User'];
                        
                        // Create a default 'artist' profile. The user can edit this later.
                        const defaultProfileData = {
                            id: authUser.uid,
                            firstName: firstName || 'Recovered',
                            lastName: lastName || 'User',
                            email: authUser.email!,
                            role: 'artist' as const, // Default to artist, can be changed
                            isVerified: false,
                            createdAt: now,
                            updatedAt: now,
                            lastActive: now,
                            // Add other necessary fields for a default artist to avoid type errors
                            artistType: 'other' as const,
                            agencyAffiliated: false,
                            availableForBooking: true,
                            travelReady: false,
                            remoteWorkOk: false,
                            stats: { eventsAttended: 0, eventsHosted: 0, connectionsCount: 0, averageRating: 0, totalReviews: 0, profileViews: 0, portfolioViews: 0 },
                        };
                        
                        const creationResult = await addUserProfile(authUser.uid, defaultProfileData);
                        if (creationResult.success && creationResult.data) {
                            console.log("useUser.ts: Default profile created successfully for UID:", authUser.uid);
                            data = creationResult.data;
                        } else {
                            console.error("useUser.ts: FATAL: Failed to create recovery profile for UID:", authUser.uid);
                            toast({
                                variant: 'destructive',
                                title: 'Login Failed',
                                description: 'We could not create a user profile for your account. Please contact support.',
                            });
                            clearUser();
                            Cookies.remove('user-token');
                            setLoading(false);
                            return;
                        }
                    }

                    if (data) {
                        const serializableData = convertTimestamps(data);
                        console.log("useUser.ts: Profile data found/created. Setting user state.", serializableData);
                        setUser({
                            ...authUser,
                            ...serializableData,
                            id: authUser.uid, // ensure id is set from authUser
                            token: token,
                        });
                    }
                } else {
                     const token = await authUser.getIdToken();
                     // If user exists but token is missing, update it
                     if (user && !user.token) {
                         setUser({ ...user, token });
                     }
                    console.log("useUser.ts: onAuthStateChanged - Current app user is already up-to-date.");
                }
            } else {
                console.log("useUser.ts: onAuthStateChanged - No user authenticated. Clearing user state.");
                clearUser();
                Cookies.remove('user-token');
            }
            setLoading(false);
        });

        return () => {
            console.log("useUser.ts: Cleaning up onAuthStateChanged listener.");
            unsubscribe();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return { user, loading };
}
