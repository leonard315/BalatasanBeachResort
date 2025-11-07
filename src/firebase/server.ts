// src/firebase/server.ts
import { initializeApp, getApps, App, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
  : undefined;

let app: App;

if (getApps().length === 0) {
  if (serviceAccount) {
    app = initializeApp({
      credential: cert(serviceAccount),
    });
  } else {
    // This is for local development without service account credentials.
    // It will use the default credentials if available (e.g., from gcloud CLI).
    app = initializeApp();
  }
} else {
  app = getApps()[0];
}

export const adminDb = getFirestore(app);
