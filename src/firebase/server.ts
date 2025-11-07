// src/firebase/server.ts
import { initializeApp, getApps, App, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// IMPORTANT: This service account key is required for server-side authentication (e.g., in Server Actions).
// You must create a service account in your Firebase project settings, generate a new private key (JSON file),
// and set the contents of that JSON file as a `FIREBASE_SERVICE_ACCOUNT_KEY` environment variable in your deployment environment.
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
    // This will likely fail in a deployed environment like Vercel without a service account.
    app = initializeApp();
  }
} else {
  app = getApps()[0];
}

export const adminDb = getFirestore(app);
