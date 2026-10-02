import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;

const app = getApps().length
  ? getApps()[0]
  : initializeApp(serviceAccountJson ? { credential: cert(JSON.parse(serviceAccountJson)) } : undefined);

export const adminAuth = getAuth(app);
export const db = getFirestore(app);
