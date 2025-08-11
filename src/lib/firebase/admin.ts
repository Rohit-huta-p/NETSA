
import admin from 'firebase-admin';

// This function attempts to parse the service account JSON and restores newlines in the private key.
const parseServiceAccount = (jsonString: string) => {
    try {
        const serviceAccount = JSON.parse(jsonString);
        if (serviceAccount.private_key) {
            serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
        }
        return serviceAccount;
    } catch (error) {
        console.error("admin.ts: FATAL: Could not parse GOOGLE_APPLICATION_CREDENTIALS_JSON. Error:", error);
        return null;
    }
}


if (!admin.apps.length) {
    const serviceAccountJson = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

    if (serviceAccountJson) {
        console.log("admin.ts: Initializing Firebase Admin SDK with service account from GOOGLE_APPLICATION_CREDENTIALS_JSON...");
        const serviceAccount = parseServiceAccount(serviceAccountJson);
        
        if (serviceAccount) {
            try {
                admin.initializeApp({
                    credential: admin.credential.cert(serviceAccount),
                    projectId: serviceAccount.project_id || projectId,
                });
                console.log("admin.ts: Firebase Admin SDK initialized successfully from service account.");
            } catch (initError) {
                console.error("admin.ts: FATAL: Firebase Admin SDK initialization from service account failed. Error:", initError);
            }
        }
    } else {
         console.warn("admin.ts: GOOGLE_APPLICATION_CREDENTIALS_JSON is not set. This may fail in environments without Application Default Credentials.");
         try {
            console.log("admin.ts: Attempting to initialize with Application Default Credentials, explicitly providing projectId...");
             admin.initializeApp({
                projectId: projectId,
            });
            console.log("admin.ts: Firebase Admin SDK initialized successfully with Application Default Credentials.");
         } catch (e) {
            console.error("admin.ts: FATAL: Initialization with Application Default Credentials failed. Please ensure your environment is configured correctly or set GOOGLE_APPLICATION_CREDENTIALS_JSON. Error:", e);
         }
    }
}


const authAdmin = admin.auth();
const dbAdmin = admin.firestore();

export { authAdmin, dbAdmin };
