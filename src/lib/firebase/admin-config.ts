import * as admin from 'firebase-admin';
import type { UserProfile } from '@/store/userStore';

function initializeFirebaseAdmin() {
  if (admin.apps.length > 0) {
    return admin.app();
  }

  const serviceAccountJson = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;
  if (!serviceAccountJson) {
    throw new Error(
      'The GOOGLE_APPLICATION_CREDENTIALS_JSON environment variable was not found.'
    );
  }

  try {
    const serviceAccount = JSON.parse(serviceAccountJson);
    return admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } catch (error: any) {
    console.error('Firebase Admin initialization error:', error.message);
    throw new Error('Failed to initialize Firebase Admin SDK. Check the format of your GOOGLE_APPLICATION_CREDENTIALS_JSON.');
  }
}

const app = initializeFirebaseAdmin();
export const adminDb = admin.firestore(app);
export const adminAuth = admin.auth(app);

export async function getAdminUserProfile(userId: string) {
    try {
        const docRef = adminDb.collection('users').doc(userId);
        const docSnap = await docRef.get();
        if (docSnap.exists) {
            return { data: docSnap.data() as UserProfile, error: null };
        } else {
            return { data: null, error: 'No such document!' };
        }
    } catch (error: any) {
        console.error("Error fetching user profile (admin):", error);
        return { data: null, error: error.message };
    }
}
