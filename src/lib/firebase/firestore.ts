import { doc, setDoc } from "firebase/firestore";
import { db } from "./config";

export async function addUserProfile(userId, data) {
  try {
    await setDoc(doc(db, "users", userId), data);
    return { success: true, error: null };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
