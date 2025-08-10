
import admin from 'firebase-admin';

if (!admin.apps.length) {
    try {
        console.log("admin.ts: Attempting to initialize Firebase Admin SDK with default credentials...");
        // This will work in deployed Google Cloud environments
        admin.initializeApp();
        console.log("admin.ts: Firebase Admin SDK initialized successfully with default credentials.");
    } catch (e) {
        console.warn("admin.ts: Default credential initialization failed. Falling back to GOOGLE_APPLICATION_CREDENTIALS_JSON.", e);
        
        if (process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
            try {
                console.log("admin.ts: Initializing with service account from environment variable...");
                const serviceAccount = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);
                
                // The private key from an env var needs to have its newlines restored
                if (serviceAccount.private_key) {
                    serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
                }

                admin.initializeApp({
                    credential: admin.credential.cert(serviceAccount),
                    projectId: serviceAccount.project_id,
                });
                console.log("admin.ts: Firebase Admin SDK initialized successfully from service account.");

            } catch (initError) {
                console.error("admin.ts: FATAL: Could not initialize Firebase Admin SDK from service account JSON. Error:", initError);
            }
        } else {
            console.error("admin.ts: FATAL: GOOGLE_APPLICATION_CREDENTIALS_JSON is not set. Firebase Admin SDK could not be initialized.");
        }
    }
}


const authAdmin = admin.auth();
const dbAdmin = admin.firestore();

export { authAdmin, dbAdmin };
