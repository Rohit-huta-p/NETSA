
import { doc, getDoc, setDoc, Timestamp, collection, addDoc, getDocs, enableIndexedDbPersistence, query, where, orderBy, limit as limitFn, startAfter, getCountFromServer } from "firebase/firestore";
import { db } from "./config";
import type { UserProfile } from "@/store/userStore";
import type { Gig, Event, GetGigsQuery } from '@/lib/types';

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


// Helper function to convert Firestore Timestamps to Date objects
const convertTimestamps = (data: any): any => {
    if (!data) return data;
    const newData: { [key: string]: any } = {};
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

    if (error || !organizerProfile) {
        return { success: false, id: null, error: "Organizer profile not found." };
    }
    
    if (organizerProfile.role !== 'organizer') {
        return { success: false, id: null, error: "Invalid organizer profile or permissions." };
    }

    const now = new Date();

    // Reconstructing dates that may have been stringified during JSON transport
    const startDate = gigData.startDate ? new Date(gigData.startDate) : now;
    const endDate = gigData.endDate ? new Date(gigData.endDate) : undefined;
    const applicationDeadline = gigData.applicationDeadline ? new Date(gigData.applicationDeadline) : undefined;
    const expiresAt = gigData.expiresAt ? new Date(gigData.expiresAt) : undefined;


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
        applicationDeadline: applicationDeadline,
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
        expiresAt: expiresAt,
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
        hostInfo: { name: 'Demo Host', bio: 'Experienced host', credentials:[], experience: '5 years', rating: 5, totalParticipants: 0, profileImageUrl: '' },
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

export async function getGigs(filters: GetGigsQuery) {
    const {
        page = 1,
        limit: limitParam = 10,
        category,
        artistType,
        location,
        compensation_min,
        compensation_max,
        experience_level,
        is_remote,
        start_date_from,
        start_date_to,
        search,
        sort = 'newest'
    } = filters;

    try {
        const constraints = [];

        // --- FILTERING ---
        if (category) constraints.push(where('category', '==', category));
        if (artistType && artistType.length > 0) constraints.push(where('artistType', 'array-contains-any', artistType));
        if (location) constraints.push(where('location.city', '==', location));
        if (experience_level) constraints.push(where('experienceLevel', '==', experience_level));
        if (is_remote !== undefined) constraints.push(where('location.isRemote', '==', is_remote));
        
        // Date range
        if (start_date_from) constraints.push(where('startDate', '>=', new Date(start_date_from)));
        if (start_date_to) constraints.push(where('startDate', '<=', new Date(start_date_to)));
        
        // Compensation range - Firestore cannot query ranges on different fields. This requires post-processing or a different data structure.
        // For now, we will filter by minimum compensation only if it's provided.
        if (compensation_min !== undefined) constraints.push(where('compensation.amount', '>=', compensation_min));
        if (compensation_max !== undefined) constraints.push(where('compensation.amount', '<=', compensation_max));


        // --- SORTING ---
        switch (sort) {
            case 'oldest':
                constraints.push(orderBy('createdAt', 'asc'));
                break;
            case 'compensation_high':
                constraints.push(orderBy('compensation.amount', 'desc'));
                break;
            case 'compensation_low':
                constraints.push(orderBy('compensation.amount', 'asc'));
                break;
            case 'deadline':
                constraints.push(orderBy('applicationDeadline', 'asc'));
                break;
            case 'newest':
            default:
                constraints.push(orderBy('createdAt', 'desc'));
                break;
        }

        const finalQuery = query(collection(db, 'gigs'), ...constraints);
        
        // --- PAGINATION ---
        const totalGigsSnapshot = await getCountFromServer(finalQuery);
        const total = totalGigsSnapshot.data().count;

        const totalPages = Math.ceil(total / limitParam);
        const currentPage = Math.max(1, page);
        const hasMore = currentPage < totalPages;
        
        let paginatedQuery = query(finalQuery, limitFn(limitParam));

        if (page > 1) {
            const lastVisibleDocQuery = query(finalQuery, limitFn((page - 1) * limitParam));
            const lastVisibleDocSnapshot = await getDocs(lastVisibleDocQuery);
            const lastVisible = lastVisibleDocSnapshot.docs[lastVisibleDocSnapshot.docs.length - 1];
            if (lastVisible) {
                paginatedQuery = query(finalQuery, startAfter(lastVisible), limitFn(limitParam));
            }
        }
        
        const gigsSnapshot = await getDocs(paginatedQuery);
        const gigsList = gigsSnapshot.docs.map(doc => {
            const data = doc.data();
            const serializableData = convertTimestamps(data);
            return { id: doc.id, ...serializableData };
        }) as Gig[];
        
        // TODO: Aggregate filters dynamically
        const response = {
            gigs: gigsList,
            total,
            hasMore,
            currentPage,
            totalPages,
            filters: {
                categories: [],
                locations: [],
                artistTypes: [],
                experienceLevels: [],
                compensationRanges: [],
            }
        };

        return { data: response, error: null };
    } catch (error: any) {
        console.error("Error fetching gigs: ", error.code, error.message);
        return { data: null, error: error.message };
    }
}


export async function getEvents() {
    try {
        const eventsCollection = collection(db, 'events');
        const eventSnapshot = await getDocs(eventsCollection);
        const eventsList = eventSnapshot.docs.map(doc => {
            const data = doc.data();
            const serializableData = convertTimestamps(data);
            return { id: doc.id, ...serializableData };
        });
        return { data: eventsList as Event[], error: null };
    } catch (error: any) {
        console.error("Error fetching events: ", error.code, error.message);
        return { data: [], error: error.message };
    }
}


export async function getEvent(eventId: string) {
    try {
        const docRef = doc(db, 'events', eventId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const data = docSnap.data() as Event;
            const serializableData = convertTimestamps(data);
            return { data: serializableData as Event, error: null };
        } else {
            return { data: null, error: 'No such document!' };
        }
    } catch (error: any) {
        console.error("Error fetching event:", error);
        return { data: null, error: error.message };
    }
}
