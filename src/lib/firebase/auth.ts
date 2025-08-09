
import { createUserWithEmailAndPassword, signInWithEmailAndPassword as firebaseSignIn } from "firebase/auth";
import { auth } from "./config";

/**
 * Signs up a new user with email and password in Firebase Authentication.
 * This is used for creating a new account.
 * @param email The user's email.
 * @param password The user's password.
 * @returns An object with the user object on success, or an error message on failure.
 */
export async function signUpWithEmailAndPassword(email, password) {
  try {
    console.log("signUpWithEmailAndPassword: ",email, password);
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return { user: userCredential.user, error: null };
  } catch (error) {
    console.log("Error signing in: ", error.message);
    return { user: null, error: error.message };
  }
}

/**
 * Signs in an existing user with email and password.
 * This is used for logging in users who already have an account.
 * @param email The user's email.
 * @param password The user's password.
 * @returns An object with the user object on success, or an error message on failure.
 */
export async function signInWithEmailAndPassword(email, password) {
    try {
      const userCredential = await firebaseSignIn(auth, email, password);
      return { user: userCredential.user, error: null };
    } catch (error) {
      return { user: null, error: error.message };
    }
  }
