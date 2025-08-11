
'use server';

import { Timestamp } from "firebase-admin/firestore";
import { dbAdmin } from "../firebase/admin";
import type { UserProfile } from "@/store/userStore";
import type { Gig, Event } from '@/lib/types';


// Helper function to convert Firestore Timestamps to Date objects for serialization
const convertTimestamps = (data: any): any => {
    if (!data) return data;
    const newData: { [key:string]: any } = {};
    for (const key in data) {
        if (data[key] instanceof Timestamp) {
            newData[key] = data[key].toDate();
        } else if (typeof data[key] === 'object' && data[key] !== null && !Array.isArray(data[key]) && !(data[key] instanceof Date)) {
            // Recursively convert for nested objects
            newData[key] = convertTimestamps(data[key]);
        } else {
            // Assign all other data types as they are
            newData[key] = data[key];
        }
    }
    return newData;
};


/**
 * [SERVER-SIDE ONLY] Fetches a user profile using the Firebase Admin SDK.
 * This should only be used in Server Components and API Routes.
 * @param userId The ID of the user to fetch.
 * @returns An object with the user profile data or an error.
 */
export async function getUserProfile_Admin(userId: string): Promise<{ data: UserProfile | null; error: string | null }> {
    console.log(`actions.ts (SERVER): getUserProfile_Admin called for userId: "${userId}"`);
    if (!userId) {
        const errorMsg = "Invalid user ID provided.";
        console.error(`actions.ts (SERVER): ${errorMsg}`);
        return { data: null, error: errorMsg };
    }
    try {
        const docRef = dbAdmin.collection('users').doc(userId);
        const docSnap = await docRef.get();

        if (docSnap.exists) {
            console.log(`actions.ts (SERVER): Found profile for userId: "${userId}"`);
            const data = docSnap.data() as UserProfile;
            const serializableData = convertTimestamps(data);
            return { data: serializableData as UserProfile, error: null };
        } else {
            const errorMsg = `User profile not found for userId: "${userId}"`;
            console.warn(`actions.ts (SERVER): ${errorMsg}`);
            return { data: null, error: errorMsg };
        }
    } catch (error: any) {
        const errorMsg = `Error fetching profile for userId: "${userId}". Reason: ${error.message}`;
        console.error(`actions.ts (SERVER): ${errorMsg}`);
        return { data: null, error: "An internal server error occurred while fetching the user profile." };
    }
}

/**
 * [SERVER-SIDE ONLY] Adds a new gig to Firestore.
 * This should only be used in API Routes.
 * @param organizerId The ID of the organizer creating the gig.
 * @param gigData The gig data from the client.
 * @returns An object with success status, new gig ID, or an error.
 */
export async function addGig(organizerId: string, gigData: Partial<Gig>): Promise<{ success: boolean; id: string | null; error: Error | null; }> {
    console.log(`actions.ts (SERVER): addGig called. Attempting to find profile for organizerId: ${organizerId}`);

    const { data: organizerProfile, error: profileError } = await getUserProfile_Admin(organizerId);
    if (profileError || !organizerProfile) {
        const errorMessage = `Organizer profile not found for ID: ${organizerId}. Error: ${profileError || 'No data returned'}`;
        console.error(`actions.ts (SERVER): addGig failed - ${errorMessage}`);
        return { success: false, id: null, error: new Error("Organizer profile not found.") };
    }
    
    console.log(`actions.ts (SERVER): Found organizer profile for ${organizerProfile.firstName} ${organizerProfile.lastName}. Role: ${organizerProfile.role}`);
    if (organizerProfile.role !== 'organizer') {
        console.error(`actions.ts (SERVER): addGig failed - User ${organizerId} has role '${organizerProfile.role}', not 'organizer'.`);
        return { success: false, id: null, error: new Error("Invalid user role. Only organizers can post gigs.") };
    }
    
    console.log("actions.ts (SERVER): Organizer profile validated for ID:", organizerId);

    const now = new Date();
    // Reconstructing dates that may have been stringified during JSON transport
    const startDate = gigData.startDate ? new Date(gigData.startDate) : now;
    const endDate = gigData.endDate ? new Date(gigData.endDate) : undefined;
    const applicationDeadline = gigData.applicationDeadline ? new Date(gigData.applicationDeadline) : undefined;
    const expiresAt = gigData.expiresAt ? new Date(gigData.expiresAt) : undefined;
    
    const fullGigData: Omit<Gig, 'id'> = {
        organizerId: organizerId,
        organizerInfo: {
            name: `${organizerProfile.firstName} ${organizerProfile.lastName}`,
            organization: (organizerProfile as any).organizationName || 'Individual',
            profileImageUrl: organizerProfile.profileImageUrl || '',
            organizationLogoUrl: (organizerProfile as any).organizationLogoUrl || '',
            rating: organizerProfile.stats?.averageRating || 0,
        },
        title: gigData.title || 'Untitled Gig',
        description: gigData.description || '',
        type: gigData.type || 'performance',
        category: gigData.category || '',
        artistType: gigData.artistType || [],
        requiredSkills: gigData.requiredSkills || [],
        requiredStyles: gigData.requiredStyles || [],
        experienceLevel: gigData.experienceLevel || 'beginner',
        ageRange: gigData.ageRange,
        genderPreference: gigData.genderPreference,
        physicalRequirements: gigData.physicalRequirements,
        location: {
            city: gigData.location?.city || '',
            country: gigData.location?.country || '',
            venue: gigData.location?.venue,
            address: gigData.location?.address,
            isRemote: gigData.location?.isRemote || false,
        },
        startDate: startDate,
        endDate: endDate,
        duration: gigData.duration,
        timeCommitment: gigData.timeCommitment,
        compensation: {
            type: (gigData.compensation as any)?.type || 'project',
            amount: (gigData.compensation as any)?.amount,
            currency: (gigData.compensation as any)?.currency || 'USD',
            negotiable: (gigData.compensation as any)?.negotiable || false,
            additionalBenefits: (gigData.compensation as any)?.additionalBenefits,
        },
        maxApplications: gigData.maxApplications,
        currentApplications: 0,
        applicationDeadline: applicationDeadline,
        mediaRequirements: gigData.mediaRequirements,
        status: gigData.status || 'draft',
        isUrgent: gigData.isUrgent || false,
        isFeatured: gigData.isFeatured || false,
        tags: gigData.tags || [],
        views: 0,
        applications: 0,
        saves: 0,
        createdAt: now,
        updatedAt: now,
        expiresAt: expiresAt,
    };
    
    // Firestore does not accept `undefined` values.
    // We need to remove keys that have an undefined value.
    const cleanGigData = JSON.parse(JSON.stringify(fullGigData));


    try {
        console.log("actions.ts (SERVER): Attempting to add gig document to Firestore with data:", cleanGigData);
        const docRef = await dbAdmin.collection("gigs").add(cleanGigData);
        console.log("actions.ts (SERVER): Gig document added successfully with ID:", docRef.id);
        return { success: true, id: docRef.id, error: null };
    } catch (e: any) {
        console.error("actions.ts (SERVER): Error adding gig document:", e);
        return { success: false, id: null, error: e };
    }
}

/**
 * [SERVER-SIDE ONLY] Adds a new event to Firestore.
 * This should only be used in API Routes.
 * @param organizerId The ID of the organizer creating the event.
 * @param eventData The event data from the client.
 * @returns An object with success status, new event ID, or an error.
 */
export async function addEvent(organizerId: string, eventData: any): Promise<{ success: boolean; id: string | null; error: Error | null; }> {
    const { data: organizerProfile, error } = await getUserProfile_Admin(organizerId);

    if (error || !organizerProfile) {
        return { success: false, id: null, error: new Error("Organizer profile not found.") };
    }
    
    if (organizerProfile.role !== 'organizer') {
        return { success: false, id: null, error: new Error("Invalid user role. Only organizers can post events.") };
    }
    
    const now = new Date();
    
    const fullEventData: Omit<Event, 'id'> = {
        title: eventData.title || 'Untitled Event',
        description: eventData.description || '',
        category: eventData.category || 'workshop',
        skillLevel: eventData.skillLevel || 'all_levels',
        location: {
            type: eventData.locationType || 'in_person',
            city: eventData.city || '',
            country: eventData.country || '',
            venue: eventData.venue || '',
        },
        pricing: {
            amount: eventData.price ?? 0,
            currency: 'USD',
            paymentType: (eventData.price ?? 0) > 0 ? 'full' : 'free',
        },
        schedule: {
            startDate: eventData.startDate ? new Date(eventData.startDate) : now,
            endDate: eventData.startDate ? new Date(eventData.startDate) : now, // Assuming single day event for now
            sessions: [],
        },
        maxParticipants: eventData.maxParticipants || 10,
        organizerId: organizerId,
        hostId: organizerId, // Assuming organizer is the host
        createdAt: now,
        updatedAt: now,
        status: eventData.status || 'draft',
        currentRegistrations: 0,
        views: 0,
        saves: 0,
        organizerInfo: { 
            name: `${organizerProfile.firstName} ${organizerProfile.lastName}`,
            rating: organizerProfile.stats?.averageRating || 0,
            organization: (organizerProfile as any).organizationName,
        },
        hostInfo: { 
            name: `${organizerProfile.firstName} ${organizerProfile.lastName}`, 
            bio: 'Experienced host', 
            credentials: [], 
            experience: '5 years', 
            rating: organizerProfile.stats?.averageRating || 0, 
            totalParticipants: 0, 
            profileImageUrl: organizerProfile.profileImageUrl || '' 
        },
        duration: { totalHours: 2, sessionsCount: 1, sessionDuration: 120, daysDuration: 1 },
        waitlistEnabled: false,
        providesCertificate: false,
        isRecurring: false,
        isFeatured: false,
    };

    const cleanEventData = JSON.parse(JSON.stringify(fullEventData));


    try {
        const docRef = await dbAdmin.collection("events").add(cleanEventData);
        return { success: true, id: docRef.id, error: null };
    } catch (e: any) {
        console.error("actions.ts (SERVER): Error adding event: ", e);
        return { success: false, id: null, error: e };
    }
}
