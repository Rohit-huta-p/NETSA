

import { doc, getDoc, setDoc, Timestamp, collection, addDoc, getDocs, enableIndexedDbPersistence, query, where, orderBy, limit as limitFn, startAfter, getCountFromServer } from "firebase/firestore";
import { db } from "./config";
import type { UserProfile } from "@/store/userStore";
import type { Gig, Event, GetGigsQuery } from '@/lib/types';

// Enable offline persistence
try {
    enableIndexedDbPersistence(db)
      .catch((err) => {
        if (err.code == 'failed-precondition') {
          console.warn("firestore.ts: Firestore offline persistence could not be enabled: Multiple tabs open.");
        } else if (err.code == 'unimplemented') {
          console.log("firestore.ts: Firestore offline persistence is not available in this browser.");
        }
      });
} catch (error) {
    console.error("firestore.ts: Error enabling Firestore offline persistence: ", error);
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
  console.log("firestore.ts: addUserProfile called for userId:", userId);
  try {
    await setDoc(doc(db, "users", userId), data);
    console.log("firestore.ts: addUserProfile successful for userId:", userId);
    // Return the data that was just written to avoid a race condition on read
    return { data: data, success: true, error: null };
  } catch (error: any) {
    console.error("firestore.ts: addUserProfile failed for userId:", userId, "Error:", error.message);
    return { data: null, success: false, error: error.message };
  }
}

export async function getUserProfile(userId: string) {
    console.log("firestore.ts: getUserProfile called for userId:", userId);
    if (!userId) {
        console.error("firestore.ts: getUserProfile called with undefined or null userId.");
        return { data: null, error: "Invalid user ID provided." };
    }
    try {
        const docRef = doc(db, 'users', userId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            console.log("firestore.ts: getUserProfile found document for userId:", userId);
            const data = docSnap.data() as UserProfile;
            const serializableData = convertTimestamps(data);
            return { data: serializableData as UserProfile, error: null };
        } else {
            console.warn("firestore.ts: getUserProfile found no document for userId:", userId);
            return { data: null, error: 'No such document!' };
        }
    } catch (error: any) {
        console.error("firestore.ts: getUserProfile failed for userId:", userId, "Error:", error.message);
        return { data: null, error: error.message };
    }
} 

export async function addGig(organizerId: string, gigData: Partial<Gig>) {
    console.log(`firestore.ts: addGig called. Attempting to find profile for organizerId: ${organizerId}`);

    const { data: organizerProfile, error } = await getUserProfile(organizerId);
    if (error || !organizerProfile) {
        console.error(`firestore.ts: addGig failed - Organizer profile not found for ID: ${organizerId}. Error: ${error || 'No data returned'}`);
        return { success: false, id: null, error: "Organizer profile not found." };
    }
    
    console.log(`firestore.ts: Found organizer profile for ${organizerProfile.firstName} ${organizerProfile.lastName}. Role: ${organizerProfile.role}`);
    if (organizerProfile.role !== 'organizer') {
        console.error(`firestore.ts: addGig failed - User ${organizerId} has role '${organizerProfile.role}', not 'organizer'.`);
        return { success: false, id: null, error: "Invalid user role. Only organizers can post gigs." };
    }
    
    console.log("firestore.ts: Organizer profile validated for ID:", organizerId);

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
    
    try {
        console.log("firestore.ts: Attempting to add gig document to Firestore.");
        const docRef = await addDoc(collection(db, "gigs"), fullGigData);
        console.log("firestore.ts: Gig document added successfully with ID:", docRef.id);
        return { success: true, id: docRef.id, error: null };
    } catch (e: any) {
        console.error("firestore.ts: Error adding gig document:", e);
        return { success: false, id: null, error: e.message };
    }
}

export async function addEvent(organizerId: string, eventData: any) {
    console.log("firestore.ts: addEvent called for organizerId:", organizerId);
    const { data: organizerProfile, error } = await getUserProfile(organizerId);

    if (error || !organizerProfile) {
        console.error("firestore.ts: addEvent failed - Organizer profile not found for ID:", organizerId, "Error:", error);
        return { success: false, id: null, error: "Organizer profile not found." };
    }
    
    if (organizerProfile.role !== 'organizer') {
        console.error(`firestore.ts: addEvent failed - User ${organizerId} has role '${organizerProfile.role}', not 'organizer'.`);
        return { success: false, id: null, error: "Invalid user role. Only organizers can post events." };
    }

    const now = new Date();
    const fullEventData = {
        ...eventData,
        organizerId: organizerId,
        hostId: organizerId, // Assuming organizer is the host for now
        createdAt: now,
        updatedAt: now,
        status: 'published',
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
        schedule: { startDate: new Date(eventData.startDate), endDate: new Date(eventData.startDate), sessions: [] },
        pricing: { amount: eventData.price, currency: 'USD', paymentType: 'full' }
    };

    try {
        console.log("firestore.ts: Attempting to add event document to Firestore.");
        const docRef = await addDoc(collection(db, "events"), fullEventData);
        console.log("firestore.ts: Event document added successfully with ID:", docRef.id);
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
        
        if (start_date_from) constraints.push(where('startDate', '>=', new Date(start_date_from)));
        if (start_date_to) constraints.push(where('startDate', '<=', new Date(start_date_to)));
        
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
