
import admin from 'firebase-admin';

if (!admin.apps.length) {
    if (process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
        // Parse the service account from .env
        const serviceAccount = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);

        // The private key from an env var needs to have its newlines restored
        if (serviceAccount.private_key) {
            serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
        }

        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            projectId: serviceAccount.project_id,
        });
    } else {
        // In production (Cloud Run, App Hosting), credentials will be auto-discovered
        // or you would use a different method like Application Default Credentials.
        admin.initializeApp();
    }
}


const authAdmin = admin.auth();
const dbAdmin = admin.firestore();

export { authAdmin, dbAdmin };
