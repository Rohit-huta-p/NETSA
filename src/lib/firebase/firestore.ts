

import { doc, getDoc, setDoc, Timestamp, collection, addDoc, getDocs, enableIndexedDbPersistence, query, where, orderBy, limit as limitFn, startAfter, getCountFromServer } from "firebase/firestore";
import { db } from "./config";
import type { UserProfile } from "@/store/userStore";
import type { Event, GetGigsQuery, Gig } from '@/lib/types';

// Enable offline persistence
try {
    if (typeof window !== 'undefined') {
        enableIndexedDbPersistence(db)
          .catch((err) => {
            if (err.code == 'failed-precondition') {
              console.warn("firestore.ts: Firestore offline persistence could not be enabled: Multiple tabs open.");
            } else if (err.code == 'unimplemented') {
              console.log("firestore.ts: Firestore offline persistence is not available in this browser.");
            }
          });
    }
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
    console.log("firestore.ts: getUserProfile (CLIENT) called for userId:", userId);
    if (!userId) {
        console.error("firestore.ts: getUserProfile (CLIENT) called with undefined or null userId.");
        return { data: null, error: "Invalid user ID provided." };
    }
    try {
        const docRef = doc(db, 'users', userId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            console.log("firestore.ts: getUserProfile (CLIENT) found document for userId:", userId);
            const data = docSnap.data() as UserProfile;
            const serializableData = convertTimestamps(data);
            return { data: serializableData as UserProfile, error: null };
        } else {
            console.warn("firestore.ts: getUserProfile (CLIENT) found no document for userId:", userId);
            return { data: null, error: 'No such document!' };
        }
    } catch (error: any) {
        console.error("firestore.ts: getUserProfile (CLIENT) failed for userId:", userId, "Error:", error.message);
        return { data: null, error: error.message };
    }
} 

export async function getEvents(organizerId?: string) {
    try {
        const eventsCollection = collection(db, 'events');
        const constraints = [];
        if (organizerId) {
            constraints.push(where('organizerId', '==', organizerId));
        }

        const q = query(eventsCollection, ...constraints);
        const eventSnapshot = await getDocs(q);

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

export async function getMyGigs(organizerId: string) {
    try {
        const gigsCollectionRef = collection(db, 'gigs');
        const q = query(gigsCollectionRef, where('organizerId', '==', organizerId));
        const querySnapshot = await getDocs(q);
        const gigsList = querySnapshot.docs.map(doc => {
            const data = doc.data();
            const serializableData = convertTimestamps(data);
            return { id: doc.id, ...serializableData };
        }) as Gig[];
        return { data: gigsList, error: null };
    } catch (error: any) {
        console.error("Error fetching user's gigs: ", error.message);
        return { data: [], error: error.message };
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
        let gigsCollectionRef = collection(db, 'gigs');
        let allGigs: Gig[] = [];

        // Firestore doesn't support text search on multiple fields or partial matches natively.
        // For a robust solution, a third-party service like Algolia is recommended.
        // For this implementation, we will fetch all gigs and filter them on the client-side for the search term.
        // Filtering by other fields will be done server-side.
        
        const constraints = [];

        // --- FILTERING (Server-side) ---
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
        // Note: Complex sorting is difficult with Firestore when using multiple inequality filters.
        // The primary sort order should be consistent.
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

        const serverQuery = query(gigsCollectionRef, ...constraints);
        const querySnapshot = await getDocs(serverQuery);
        
        allGigs = querySnapshot.docs.map(doc => {
            const data = doc.data();
            const serializableData = convertTimestamps(data);
            return { id: doc.id, ...serializableData };
        }) as Gig[];


        // --- SEARCH FILTERING (Client-side simulation) ---
        let filteredGigs = allGigs;
        if (search) {
            const lowercasedSearch = search.toLowerCase();
            filteredGigs = allGigs.filter(gig => 
                gig.title.toLowerCase().includes(lowercasedSearch) || 
                gig.description.toLowerCase().includes(lowercasedSearch) ||
                gig.category.toLowerCase().includes(lowercasedSearch)
            );
        }

        // --- PAGINATION ---
        const total = filteredGigs.length;
        const totalPages = Math.ceil(total / limitParam);
        const currentPage = Math.max(1, page);
        const hasMore = currentPage < totalPages;
        
        const startIndex = (currentPage - 1) * limitParam;
        const endIndex = startIndex + limitParam;
        const paginatedGigs = filteredGigs.slice(startIndex, endIndex);
        
        const response = {
            gigs: paginatedGigs,
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
