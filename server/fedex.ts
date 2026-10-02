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

export async function fedexRequest<T>(path: string, payload: unknown, transactionId?: string): Promise<T> {
  const token = await getAccessToken();
  const response = await fetch(baseUrl + path, {
    method: 'POST',
    headers: {
      authorization: 'Bearer ' + token,
      'content-type': 'application/json',
      accept: 'application/json',
      ...(transactionId ? { 'x-customer-transaction-id': transactionId } : {}),
    },
    body: JSON.stringify(payload),
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) throw new Error('FedEx API request failed with status ' + response.status + '.');
  return data as T;
}

function toParty(address: any) {
  return {
    address: {
      streetLines: [address.address].filter(Boolean),
      city: address.city,
      stateOrProvinceCode: address.state || undefined,
      postalCode: address.postalCode,
      countryCode: address.country,
      residential: false,
    },
    contact: {
      personName: address.name,
      companyName: address.company || undefined,
      phoneNumber: address.phone,
      emailAddress: address.email || undefined,
    },
  };
}

export async function createFedexShipment(input: {
  sender: any;
  recipient: any;
  packageInfo: any;
  service: string;
  currency: string;
  declaredValue?: number;
  shipDate?: string;
  transactionId?: string;
}) {
  if (!fedexConfigured() || !process.env.FEDEX_ACCOUNT_NUMBER) {
    throw new Error('FedEx shipping credentials are not configured.');
  }
  const response = await fedexRequest<any>('/ship/v1/shipments', {
    requestedShipment: {
      shipDatestamp: input.shipDate || new Date().toISOString().slice(0, 10),
      pickupType: 'USE_SCHEDULED_PICKUP',
      serviceType: input.service,
      packagingType: 'YOUR_PACKAGING',
      totalWeight: Number(input.packageInfo.weight),
      shipper: toParty(input.sender),
      recipients: [toParty(input.recipient)],
      totalDeclaredValue: {
        amount: Number(input.declaredValue || 0),
        currency: input.currency,
      },
      requestedPackageLineItems: [{
        weight: { units: 'KG', value: Number(input.packageInfo.weight) },
        dimensions: {
          length: Number(input.packageInfo.length || 1),
          width: Number(input.packageInfo.width || 1),
          height: Number(input.packageInfo.height || 1),
          units: 'CM',
        },
        groupPackageCount: Number(input.packageInfo.pieces || 1),
      }],
    },
    labelResponseOptions: 'URL_ONLY',
    accountNumber: { value: process.env.FEDEX_ACCOUNT_NUMBER },
    shipAction: 'CONFIRM',
    version: { major: '1', minor: '1', patch: '1' },
  }, input.transactionId);
  return response;
}
