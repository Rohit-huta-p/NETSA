
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./config";
import { UserProfile } from "@/store/userStore";

export async function addUserProfile(userId: string, data: any) {
  try {
    await setDoc(doc(db, "users", userId), data);
    return { success: true, error: null };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// This function now fetches from the API route instead of directly from Firestore client-side
export async function getUserProfile(userId: string) {
  try {
    console.log("User Id:",userId)
    const response = await fetch(`/api/users/${userId}`);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Failed to fetch user profile with status: ${response.status}`);
    }
    const { data } = await response.json();
    return { data, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
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
