import 'dotenv/config';

const baseUrl = (process.env.FEDEX_BASE_URL || 'https://apis.fedex.com').replace(/\/$/, '');
let cachedToken: { accessToken: string; expiresAt: number } | null = null;

export const fedexConfigured = () => Boolean(process.env.FEDEX_API_KEY && process.env.FEDEX_API_SECRET);

async function getAccessToken(): Promise<string> {
  if (!fedexConfigured()) throw new Error('FedEx carrier credentials are not configured.');
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) return cachedToken.accessToken;
  const body = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: process.env.FEDEX_API_KEY!,
    client_secret: process.env.FEDEX_API_SECRET!,
  });
  const response = await fetch(baseUrl + '/oauth/token', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body,
  });
  if (!response.ok) throw new Error('FedEx authorization failed.');
  const data = await response.json() as { access_token?: string; expires_in?: number };
  if (!data.access_token) throw new Error('FedEx authorization returned no access token.');
  cachedToken = { accessToken: data.access_token, expiresAt: Date.now() + Math.max(60, Number(data.expires_in || 3600)) * 1000 };
  return cachedToken.accessToken;
}

export async function fedexRequest<T>(path: string, payload: unknown): Promise<T> {
  const token = await getAccessToken();
  const response = await fetch(baseUrl + path, {
    method: 'POST',
    headers: { authorization: 'Bearer ' + token, 'content-type': 'application/json', accept: 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) throw new Error('FedEx API request failed with status ' + response.status + '.');
  return data as T;
}
