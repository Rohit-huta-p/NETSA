import * as admin from 'firebase-admin';
import { UserProfile } from '@/store/userStore';

const serviceAccount = {
  projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
  clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
};

if (!admin.apps.length) {
  try {
    if (!serviceAccount.projectId || !serviceAccount.clientEmail || !serviceAccount.privateKey) {
        throw new Error("Firebase Admin SDK credentials are not set in .env.local. Please check the documentation.");
    }
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
