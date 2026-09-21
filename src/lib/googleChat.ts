import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  User,
  signOut,
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';
import { GoogleChatMessage, GoogleChatSpace } from '../types';

// Initialize Firebase App singleton
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);

// Configure Google Auth Provider with Google Workspace scopes (Chat + Drive)
export const chatScopes = [
  'https://www.googleapis.com/auth/chat.spaces',
  'https://www.googleapis.com/auth/chat.spaces.readonly',
  'https://www.googleapis.com/auth/chat.spaces.create',
  'https://www.googleapis.com/auth/chat.messages',
  'https://www.googleapis.com/auth/chat.messages.readonly',
  'https://www.googleapis.com/auth/chat.messages.create',
  'https://www.googleapis.com/auth/chat.memberships',
  'https://www.googleapis.com/auth/chat.memberships.readonly',
];

export const driveScopes = [
  'https://www.googleapis.com/auth/drive',
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/drive.readonly',
  'https://www.googleapis.com/auth/drive.metadata.readonly',
];

export const allWorkspaceScopes = [...chatScopes, ...driveScopes];

const provider = new GoogleAuthProvider();
allWorkspaceScopes.forEach((scope) => provider.addScope(scope));

// In-memory token cache (NEVER stored in localStorage or sessionStorage)
let cachedAccessToken: string | null = null;
let isSigningIn = false;

/**
 * Initializes Firebase Auth state listener and handles token lifecycle in memory.
 */
export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (cachedAccessToken) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else if (!isSigningIn) {
        cachedAccessToken = null;
        if (onAuthFailure) onAuthFailure();
      }
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

/**
 * Initiates the Google Sign-In popup requesting Google Chat access.
 */
export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Failed to retrieve access token from Google authentication credential.');
    }

    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error) {
    console.error('Google Chat Auth Error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

/**
 * Returns the in-memory access token.
 */
export const getAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};

/**
 * Sign out and clear in-memory token.
 */
export const logoutGoogle = async () => {
  await signOut(auth);
  cachedAccessToken = null;
};

/**
 * Fetches all Google Chat spaces accessible by the user.
 */
export const listChatSpaces = async (): Promise<GoogleChatSpace[]> => {
  const token = await getAccessToken();
  if (!token) {
    throw new Error('Authentication required: No active Google Chat access token in memory.');
  }

  const response = await fetch('https://chat.googleapis.com/v1/spaces', {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Google Chat API error (${response.status}): ${errText}`);
  }

  const data = await response.json();
  return (data.spaces || []) as GoogleChatSpace[];
};

/**
 * Fetches messages for a specific Google Chat space.
 */
export const listChatMessages = async (spaceName: string): Promise<GoogleChatMessage[]> => {
  const token = await getAccessToken();
  if (!token) {
    throw new Error('Authentication required: No active Google Chat access token in memory.');
  }

  const response = await fetch(
    `https://chat.googleapis.com/v1/${spaceName}/messages?pageSize=50`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Failed to load messages from space (${response.status}): ${errText}`);
  }

  const data = await response.json();
  const messages = (data.messages || []) as GoogleChatMessage[];
  // Sort oldest to newest for a standard chat stream
  return messages.sort(
    (a, b) => new Date(a.createTime || 0).getTime() - new Date(b.createTime || 0).getTime()
  );
};

/**
 * Posts a message to a specific Google Chat space.
 */
export const sendChatMessage = async (
  spaceName: string,
  text: string
): Promise<GoogleChatMessage> => {
  const token = await getAccessToken();
  if (!token) {
    throw new Error('Authentication required: No active Google Chat access token in memory.');
  }

  const response = await fetch(`https://chat.googleapis.com/v1/${spaceName}/messages`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Failed to send message to Google Chat (${response.status}): ${errText}`);
  }

  return (await response.json()) as GoogleChatMessage;
};

/**
 * Creates a new named Google Chat space (Room).
 */
export const createChatSpace = async (
  displayName: string,
  description?: string
): Promise<GoogleChatSpace> => {
  const token = await getAccessToken();
  if (!token) {
    throw new Error('Authentication required: No active Google Chat access token in memory.');
  }

  const response = await fetch('https://chat.googleapis.com/v1/spaces', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      spaceType: 'SPACE',
      displayName,
      ...(description ? { spaceDetails: { description } } : {}),
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Failed to create Google Chat space (${response.status}): ${errText}`);
  }

  return (await response.json()) as GoogleChatSpace;
};
