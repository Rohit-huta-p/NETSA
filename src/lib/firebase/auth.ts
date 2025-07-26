import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "./config";

export async function signUpWithEmailAndPassword(email, password) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return { user: userCredential.user, error: null };
  } catch (error) {
    return { user: null, error: error.message };
  }
}
