
import { doc, getDoc, setDoc, Timestamp, collection, addDoc, getDocs, enableIndexedDbPersistence } from "firebase/firestore";
import { db } from "./config";
import type { UserProfile } from "@/store/userStore";
import type { Gig, Event } from '@/lib/types';

// Enable offline persistence
try {
    enableIndexedDbPersistence(db)
      .catch((err) => {
        if (err.code == 'failed-precondition') {
          console.warn("Firestore offline persistence could not be enabled: Multiple tabs open.");
        } else if (err.code == 'unimplemented') {
          console.log("Firestore offline persistence is not available in this browser.");
        }
      });
} catch (error) {
    console.error("Error enabling Firestore offline persistence: ", error);
}


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
        throw new Error("Invalid organizer profile or permissions.");
    }
    const now = new Date();

    const fullGigData: Gig = {
        id: '', // Firestore will generate this
        organizerId: organizerId,
        organizerInfo: {
            name: `${organizerProfile.firstName} ${organizerProfile.lastName}`,
            organization: organizerProfile.organizationName || 'Individual',
            profileImageUrl: organizerProfile.profileImageUrl || '',
            organizationLogoUrl: organizerProfile.organizationLogoUrl || '',
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
        startDate: gigData.startDate ? new Date(gigData.startDate) : now,
        endDate: gigData.endDate ? new Date(gigData.endDate) : undefined,
        duration: gigData.duration,
        timeCommitment: gigData.timeCommitment,
        compensation: {
            type: gigData.compensation?.type || 'project',
            amount: gigData.compensation?.amount,
            currency: gigData.compensation?.currency,
            negotiable: gigData.compensation?.negotiable || false,
            additionalBenefits: gigData.compensation?.additionalBenefits,
        },
        maxApplications: gigData.maxApplications,
        applicationDeadline: gigData.applicationDeadline ? new Date(gigData.applicationDeadline) : undefined,
        mediaRequirements: gigData.mediaRequirements,
        status: gigData.status || 'draft',
        isUrgent: gigData.isUrgent || false,
        isFeatured: gigData.isFeatured || false,
        tags: gigData.tags || [],
        currentApplications: 0,
        views: 0,
        applications: 0,
        saves: 0,
        createdAt: now,
        updatedAt: now,
        expiresAt: gigData.expiresAt ? new Date(gigData.expiresAt) : undefined,
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

export async function getGigs() {
    try {
        const gigsCollection = collection(db, 'gigs');
        const gigSnapshot = await getDocs(gigsCollection);
        const gigsList = gigSnapshot.docs.map(doc => {
            const data = doc.data();
            const serializableData = convertTimestamps(data);
            return { id: doc.id, ...serializableData };
        });
        return { data: gigsList as Gig[], error: null };
    } catch (error: any) {
        console.error("Error fetching gigs: ", error.code, error.message);
        return { data: [], error: error.message };
    }
}
