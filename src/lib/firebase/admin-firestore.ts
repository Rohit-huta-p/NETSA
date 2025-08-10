// src/lib/firebase/admin-firestore.ts
import { Timestamp } from "firebase-admin/firestore";
import { dbAdmin } from "./admin";
import type { UserProfile } from "@/store/userStore";

// Helper function to convert Firestore Timestamps to Date objects for serialization
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

/**
 * [SERVER-SIDE ONLY] Fetches a user profile using the Firebase Admin SDK.
 * This should only be used in Server Components and API Routes.
 * @param userId The ID of the user to fetch.
 * @returns An object with the user profile data or an error.
 */
export async function getUserProfile_Admin(userId: string) {
    console.log("admin-firestore.ts: getUserProfile_Admin called for userId:", userId);
    if (!userId) {
        console.error("admin-firestore.ts: getUserProfile_Admin called with undefined or null userId.");
        return { data: null, error: "Invalid user ID provided." };
    }
    try {
        const docRef = dbAdmin.collection('users').doc(userId);
        const docSnap = await docRef.get();
        if (docSnap.exists) {
            console.log("admin-firestore.ts: getUserProfile_Admin found document for userId:", userId);
            const data = docSnap.data() as UserProfile;
            const serializableData = convertTimestamps(data);
            return { data: serializableData as UserProfile, error: null };
        } else {
            console.warn("admin-firestore.ts: getUserProfile_Admin found no document for userId:", userId);
            return { data: null, error: 'User profile not found.' };
        }
    } catch (error: any) {
        console.error("admin-firestore.ts: getUserProfile_Admin failed for userId:", userId, "Error:", error.message);
        return { data: null, error: "An internal server error occurred while fetching the user profile." };
    }
}
