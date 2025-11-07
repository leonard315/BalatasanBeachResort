// src/firebase/server.ts
import { initializeApp, getApps, App, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// IMPORTANT: This service account key is required for server-side authentication (e.g., in Server Actions).
// You must create a service account in your Firebase project settings, generate a new private key (JSON file),
// and set the contents of that JSON file as a `FIREBASE_SERVICE_ACCOUNT_KEY` environment variable in your deployment environment.
const serviceAccountString = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

let app: App;

if (getApps().length === 0) {
  if (serviceAccountString) {
    try {
      const serviceAccount = JSON.parse(serviceAccountString);
      app = initializeApp({
        credential: cert(serviceAccount),
      });
    } catch (error) {
      console.error('Error parsing Firebase service account key:', error);
      // Fallback to default initialization if parsing fails
      app = initializeApp();
    }
  } else {
    // This is for local development without service account credentials.
    // It will use the default credentials if available (e.g., from gcloud CLI).
    console.warn("FIREBASE_SERVICE_ACCOUNT_KEY not set. Using default credentials for local development. This will fail in a deployed environment.");
    app = initializeApp();
  }
} else {
  app = getApps()[0];
}

export const adminDb = getFirestore(app);
