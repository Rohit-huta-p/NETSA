
import admin from 'firebase-admin';

if (!admin.apps.length) {
  try {
    const serviceAccountJson = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;
    if (!serviceAccountJson) {
      throw new Error("GOOGLE_APPLICATION_CREDENTIALS_JSON environment variable is not set.");
    }
    
    const serviceAccount = JSON.parse(serviceAccountJson);

    // Restore newlines in the private key
    if (serviceAccount.private_key) {
      serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
    }

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: serviceAccount.project_id,
    });
    console.log("admin.ts: Firebase Admin SDK initialized successfully.");
  } catch (error: any) {
    console.error("admin.ts: FATAL: Firebase Admin SDK initialization failed:", error.message);
  }
}

const authAdmin = admin.auth();
const dbAdmin = admin.firestore();

export { authAdmin, dbAdmin };
