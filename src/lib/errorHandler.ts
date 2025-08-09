
import { FirebaseError } from 'firebase/app';

// A mapping of known Firebase Authentication error codes to user-friendly messages.
const FIREBASE_AUTH_ERROR_MESSAGES: { [key: string]: string } = {
  'auth/email-already-in-use': 'An account with this email address already exists. Please try logging in.',
  'auth/invalid-email': 'The email address you entered is not valid. Please check and try again.',
  'auth/operation-not-allowed': 'Email/password accounts are not enabled. Please contact support.',
  'auth/weak-password': 'The password is too weak. Please choose a stronger password.',
  'auth/user-disabled': 'This user account has been disabled by an administrator.',
  'auth/user-not-found': 'No account was found with this email address. Please register first.',
  'auth/wrong-password': 'The password you entered is incorrect. Please try again.',
  'auth/invalid-credential': 'The credentials you provided are incorrect. Please check your email and password.',
  'auth/too-many-requests': 'We have detected unusual activity and have blocked requests from this device. Please try again later.',
};

const DEFAULT_ERROR_MESSAGE = 'An unexpected error occurred. Please try again later or contact support if the problem persists.';

/**
 * Handles errors from various parts of the application, logs them for developers,
 * and returns a user-friendly message.
 * @param error The error object caught in a try-catch block.
 * @param context A string to provide context for where the error occurred (e.g., 'Login').
 * @returns A user-friendly error message string.
 */
export function handleAppError(error: unknown, context?: string): string {
  // Log the full error to the console for debugging purposes.
  console.error(`Error [${context || 'General'}]:`, error);

  if (error instanceof FirebaseError) {
    return FIREBASE_AUTH_ERROR_MESSAGES[error.code] || DEFAULT_ERROR_MESSAGE;
  }
  
  if (error instanceof Error) {
    // For generic JS errors, you might want to show their message in some cases
    // but a default message is often safer for the user.
    return error.message || DEFAULT_ERROR_MESSAGE;
  }

  return DEFAULT_ERROR_MESSAGE;
}
