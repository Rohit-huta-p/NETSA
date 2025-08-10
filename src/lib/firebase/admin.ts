import admin from 'firebase-admin';

// Check if the app is already initialized to prevent errors
if (!admin.apps.length) {
    // In a deployed environment like Google Cloud Run (which App Hosting uses),
    // the SDK can automatically discover credentials.
    // For local development, you would need to set up a service account file.
    admin.initializeApp({
        credential: admin.credential.applicationDefault(),
        // You might need to provide your databaseURL if it's not discovered automatically
        // databaseURL: `https://${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.firebaseio.com`
    });
}

const authAdmin = admin.auth();
const dbAdmin = admin.firestore();

export { authAdmin, dbAdmin };
