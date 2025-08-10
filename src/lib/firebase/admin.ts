import admin from 'firebase-admin';

// Check if the app is already initialized to prevent errors
if (!admin.apps.length) {
    // In a deployed environment like Google Cloud Run (which App Hosting uses),
    // the SDK can automatically discover credentials.
    // For local development, we provide the project ID to help it connect.
    admin.initializeApp({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    });
}

const authAdmin = admin.auth();
const dbAdmin = admin.firestore();

export { authAdmin, dbAdmin };
