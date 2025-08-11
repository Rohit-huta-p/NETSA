
import admin from 'firebase-admin';

if (!admin.apps.length) {
  const serviceAccountJson = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;

  if (!serviceAccountJson) {
    console.error("admin.ts: FATAL: GOOGLE_APPLICATION_CREDENTIALS_JSON environment variable is not set. The server cannot start without it.");
    // In a real app, you might want to throw an error here to stop the server process
    // throw new Error("GOOGLE_APPLICATION_CREDENTIALS_JSON is not set.");
  } else {
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

      console.log(`admin.ts: Initializing Firebase Admin SDK for project: ${serviceAccount.project_id}`);
      
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: serviceAccount.project_id,
      });

      console.log("admin.ts: Firebase Admin SDK initialized successfully.");

    } catch (error: any) {
      console.error("admin.ts: FATAL: Failed to initialize Firebase Admin SDK. Error:", error.message);
      // throw new Error(`Failed to initialize Firebase Admin SDK: ${error.message}`);
    }
  }
}


const authAdmin = admin.auth();
const dbAdmin = admin.firestore();

export { authAdmin, dbAdmin };
