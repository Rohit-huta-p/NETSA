
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./config";
import axiosInstance from "../axiosInstance";

export async function addUserProfile(userId: string, data: any) {
  try {
    await setDoc(doc(db, "users", userId), data);
    return { success: true, error: null };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// This function is for CLIENT-SIDE use only.
// It fetches user data via your API route.
export async function getUserProfileFromClient(userId: string) {
  try {
    console.log("userId",userId);
    const response = await axiosInstance.get(`/api/users/${userId}`);
    return { data: response.data.data, error: null };
  } catch (error: any) {
    console.error("Error fetching user profile (client):", error.response?.data?.error || error.message);
    const errorMessage = error.response?.data?.error || error.message;
    return { data: null, error: errorMessage };
  }
}
