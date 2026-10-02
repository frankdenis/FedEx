import { supabase } from './supabase';
import type { User } from '@supabase/supabase-js';
import { GoogleChatMessage, GoogleChatSpace } from '../types';

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
let cachedAccessToken: string | null = null;

export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  let active = true;
  const sync = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!active) return;
    const token = session?.provider_token || cachedAccessToken;
    if (session?.user && token) {
      cachedAccessToken = token;
      onAuthSuccess?.(session.user, token);
    } else {
      onAuthFailure?.();
    }
  };
  void sync();
  const { data: { subscription } } = supabase.auth.onAuthStateChange(() => { void sync(); });
  return () => { active = false; subscription.unsubscribe(); };
};

export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  cachedAccessToken = null;
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      scopes: allWorkspaceScopes.join(' '),
      redirectTo: window.location.href,
      queryParams: { access_type: 'offline', prompt: 'consent' },
    },
  });
  if (error) throw error;
  return null;
};

export const getAccessToken = async (): Promise<string | null> => {
  if (cachedAccessToken) return cachedAccessToken;
  const { data: { session } } = await supabase.auth.getSession();
  cachedAccessToken = session?.provider_token || null;
  return cachedAccessToken;
};

export const logoutGoogle = async () => {
  cachedAccessToken = null;
  await supabase.auth.signOut();
};

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
