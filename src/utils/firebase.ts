import * as admin from 'firebase-admin';

const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT;

let serviceAccount: admin.ServiceAccount | null = null;

if (serviceAccountJson) {
  // Option 1: Full service account JSON string
  serviceAccount = JSON.parse(serviceAccountJson) as admin.ServiceAccount;
} else if (
  process.env.FIREBASE_PROJECT_ID &&
  process.env.FIREBASE_CLIENT_EMAIL &&
  process.env.FIREBASE_PRIVATE_KEY
) {
  // Option 2: Individual split fields
  serviceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  } as admin.ServiceAccount;
}

if (!admin.apps.length) {
  if (serviceAccount) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } else {
    // Fallback: Application Default Credentials (works on GCP)
    admin.initializeApp();
  }
}

export default admin;
