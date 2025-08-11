
import admin from 'firebase-admin';

// Initialize a variable to hold the initialized app.
let app;

if (!admin.apps.length) {
  const serviceAccountJson = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

  if (serviceAccountJson) {
    try {
      const serviceAccount = JSON.parse(serviceAccountJson);

      // Restore newlines in the private key
      if (serviceAccount.private_key) {
        serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
      }

      // Basic validation of the parsed service account
      if (!serviceAccount.project_id || !serviceAccount.private_key) {
        throw new Error("Service account JSON is missing 'project_id' or 'private_key'.");
      }
      
      console.log(`admin.ts: Initializing Firebase Admin SDK with Service Account for project: ${serviceAccount.project_id}`);
      
      app = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: serviceAccount.project_id,
      });

      console.log("admin.ts: Firebase Admin SDK initialized successfully with Service Account.");

    } catch (error: any) {
      console.error("admin.ts: FATAL: Failed to initialize Firebase Admin SDK with Service Account. Error:", error.message);
      // Fallback to default initialization if service account fails but projectId is present
      if (projectId) {
        console.log(`admin.ts: Attempting to initialize with default credentials for project: ${projectId}`);
        app = admin.initializeApp({ projectId });
      }
    }
  } else if (projectId) {
     console.log(`admin.ts: Initializing Firebase Admin SDK with default credentials for project: ${projectId}`);
     app = admin.initializeApp({ projectId });
     console.log("admin.ts: Firebase Admin SDK initialized successfully with default credentials.");
  } else {
    console.error("admin.ts: FATAL: Could not initialize Firebase Admin SDK. Neither GOOGLE_APPLICATION_CREDENTIALS_JSON nor NEXT_PUBLIC_FIREBASE_PROJECT_ID are set.");
  }
} else {
    app = admin.app();
    console.log("admin.ts: Using existing Firebase Admin SDK app instance.");
}


const authAdmin = admin.auth();
const dbAdmin = admin.firestore();

export { authAdmin, dbAdmin };
