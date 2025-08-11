
import admin from 'firebase-admin';

// This function ensures Firebase is initialized only once.
function initializeFirebaseAdmin() {
  // If the app is already initialized, return the existing instance.
  if (admin.apps.length > 0) {
    return admin.app();
  }

  // Try to initialize with Service Account credentials from environment variable
  const serviceAccountJson = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;
  if (serviceAccountJson) {
    try {
      const serviceAccount = JSON.parse(serviceAccountJson);
      
      // The private_key in the environment variable might have escaped newlines.
      if (serviceAccount.private_key) {
        serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
      }

      console.log("admin.ts: Initializing Firebase Admin with service account credentials.");
      return admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: serviceAccount.project_id,
      });
    } catch (error: any) {
      console.error("admin.ts: Error parsing service account JSON. Falling back.", error.message);
    }
  }

  // Fallback for environments where ADC is available (like Google Cloud Run, Vercel etc.)
  console.log("admin.ts: Initializing Firebase Admin with Application Default Credentials.");
  return admin.initializeApp({
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  });
}

// Initialize the app.
initializeFirebaseAdmin();

// Export the initialized services.
const authAdmin = admin.auth();
const dbAdmin = admin.firestore();

export { authAdmin, dbAdmin };
