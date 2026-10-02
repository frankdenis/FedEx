import { getApps, getApp, initializeApp } from 'firebase/app';
import {
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  getAuth,
  sendPasswordResetEmail,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type User as FirebaseUser,
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';
import type { User } from '../types';

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);

export const initializeAuthPersistence = () =>
  setPersistence(auth, browserLocalPersistence);

export const mapFirebaseUser = (user: FirebaseUser, role: User['role'] = 'customer'): User => {
  const [firstName = '', ...lastParts] = (user.displayName || '').trim().split(/\s+/);
  return {
    id: user.uid,
    firstName,
    lastName: lastParts.join(' '),
    email: user.email || '',
    phone: user.phoneNumber || '',
    role,
    country: '',
    status: user.disabled ? 'suspended' : 'active',
    createdAt: user.metadata.creationTime || new Date().toISOString(),
  };
};

export const signInAccount = async (email: string, password: string) => {
  await initializeAuthPersistence();
  return signInWithEmailAndPassword(auth, email.trim(), password);
};

export const registerAccount = async (
  email: string,
  password: string,
  displayName: string
) => {
  await initializeAuthPersistence();
  const credential = await createUserWithEmailAndPassword(auth, email.trim(), password);
  if (displayName.trim()) {
    await updateProfile(credential.user, { displayName: displayName.trim() });
  }
  return credential;
};

export const requestPasswordReset = (email: string) =>
  sendPasswordResetEmail(auth, email.trim());

export const signOutAccount = () => signOut(auth);
