import * as admin from 'firebase-admin';
import { UserProfile } from '@/store/userStore';

const serviceAccountKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY;
if (!serviceAccountKey) {
    throw new Error('The FIREBASE_ADMIN_PRIVATE_KEY environment variable is not set.');
}

const serviceAccount = {
  projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
  clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
  // Restore the newlines for the private key
  privateKey: serviceAccountKey.replace(/\\n/g, '\n'),
};

// Initialize the app only if it hasn't been initialized yet
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as any),
    });
  } catch (error: any) {
    console.error('Firebase admin initialization error:', error.message);
  }
}

export const adminDb = admin.firestore();
export const adminAuth = admin.auth();


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
