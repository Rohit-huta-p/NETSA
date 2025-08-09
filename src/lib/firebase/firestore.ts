
import { doc, getDoc, setDoc, Timestamp, collection, addDoc } from "firebase/firestore";
import { db } from "./config";
import type { UserProfile } from "@/store/userStore";
import type { Gig, Event } from '@/lib/types';


// Helper function to convert Firestore Timestamps to strings
const convertTimestamps = (data: any) => {
    if (!data) return data;
    const newData: { [key: string]: any } = {};
    for (const key in data) {
        if (data[key] instanceof Timestamp) {
            newData[key] = data[key].toDate().toISOString();
        } else if (typeof data[key] === 'object' && data[key] !== null && !Array.isArray(data[key])) {
            newData[key] = convertTimestamps(data[key]);
        }
        else {
            newData[key] = data[key];
        }
    }
    return newData;
};


export async function addUserProfile(userId: string, data: any) {
  try {
    await setDoc(doc(db, "users", userId), data);
    return { success: true, error: null };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getUserProfile(userId: string) {
    try {
        const docRef = doc(db, 'users', userId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const data = docSnap.data() as UserProfile;
            const serializableData = convertTimestamps(data);
            return { data: serializableData as UserProfile, error: null };
        } else {
            return { data: null, error: 'No such document!' };
        }
    } catch (error: any) {
        console.error("Error fetching user profile:", error);
        return { data: null, error: error.message };
    }
}

export async function addGig(organizerId: string, gigData: Partial<Gig>) {
    const { data: organizerProfile, error } = await getUserProfile(organizerId);

    if (error || !organizerProfile || organizerProfile.role !== 'organizer') {
        throw new Error("Invalid organizer profile.");
    }

    const fullGigData: Gig = {
        id: '', // Firestore will generate this
        ...gigData,
        organizerId: organizerId,
        organizerInfo: {
            name: `${organizerProfile.firstName} ${organizerProfile.lastName}`,
            organization: organizerProfile.organizationName || 'Individual',
            profileImageUrl: organizerProfile.profileImageUrl || '',
            organizationLogoUrl: organizerProfile.organizationLogoUrl || '',
            rating: organizerProfile.stats?.averageRating || 0,
        },
        artistType: [],
        experienceLevel: 'beginner',
        location: {
            city: gigData.city || '',
            country: gigData.country || '',
            isRemote: false
        },
        startDate: new Date(),
        compensation: {
            type: gigData.compensationType || 'project',
            amount: gigData.compensationAmount || 0,
            negotiable: true,
        },
        currentApplications: 0,
        status: 'active',
        isUrgent: false,
        isFeatured: false,
        views: 0,
        applications: 0,
        saves: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    
    try {
        const docRef = await addDoc(collection(db, "gigs"), fullGigData);
        return { success: true, id: docRef.id, error: null };
    } catch (e: any) {
        console.error("Error adding gig: ", e);
        return { success: false, id: null, error: e.message };
    }
}

export async function addEvent(organizerId: string, eventData: any) {
    // This is a simplified version. A real implementation would fetch organizer/host info.
    const fullEventData = {
        ...eventData,
        organizerId: organizerId,
        hostId: organizerId, // Assuming organizer is the host for now
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'published',
        currentRegistrations: 0,
        views: 0,
        saves: 0,
        // Mock data for required nested objects
        organizerInfo: { name: 'Demo Org', rating: 5 },
        hostInfo: { name: 'Demo Host', bio: 'Experienced host', credentials:[], experience: '5 years', rating: 5, totalParticipants: 0 },
        duration: { totalHours: 2, sessionsCount: 1, sessionDuration: 120, daysDuration: 1 },
        schedule: { startDate: new Date(), endDate: new Date(), sessions: [] },
        pricing: { amount: eventData.price, currency: 'USD', paymentType: 'full' }
    };

    try {
        const docRef = await addDoc(collection(db, "events"), fullEventData);
        return { success: true, id: docRef.id, error: null };
    } catch (e: any) {
        console.error("Error adding event: ", e);
        return { success: false, id: null, error: e.message };
    }
}
