
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./config";
import { UserProfile } from "@/store/userStore";
import axiosInstance from "../axiosInstance";
import { getAdminUserProfile } from "./admin-config";

export async function addUserProfile(userId: string, data: any) {
  try {
    await setDoc(doc(db, "users", userId), data);
    return { success: true, error: null };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// This can be called from client or server. 
// If on server, it uses admin SDK. If on client, it uses axiosInstance.
export async function getUserProfile(userId: string) {
  // Server-side
  if (typeof window === 'undefined') {
    return getAdminUserProfile(userId);
  }

  // Client-side
  try {
    const response = await axiosInstance.get(`/api/users/${userId}`);
    return { data: response.data.data, error: null };
  } catch (error: any) {
    console.error("Error fetching user profile (client):", error);
    const errorMessage = error.response?.data?.error || error.message;
    return { data: null, error: errorMessage };
  }
}

// Server-side function to get artist profile
export async function getArtistProfile(userId: string): Promise<{ data: UserProfile | null, error: string | null }> {
    try {
        const docRef = doc(db, 'users', userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return { data: docSnap.data() as UserProfile, error: null };
        } else {
            return { data: null, error: 'No such document!' };
        }
    } catch (error: any) {
        return { data: null, error: error.message };
    }
}

