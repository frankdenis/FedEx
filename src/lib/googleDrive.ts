import { getAccessToken } from './googleChat';
import { GoogleDriveFile, Shipment } from '../types';

/**
 * List files from the user's Google Drive.
 */
export const listDriveFiles = async (options?: {
  query?: string;
  folderId?: string;
  pageSize?: number;
}): Promise<GoogleDriveFile[]> => {
  const token = await getAccessToken();
  if (!token) {
    throw new Error('Authentication required: No active Google Drive access token in memory.');
  }

  const queryParts: string[] = ['trashed = false'];

  if (options?.folderId) {
    queryParts.push(`'${options.folderId}' in parents`);
  }

  if (options?.query && options.query.trim()) {
    const escaped = options.query.replace(/'/g, "\\'");
    queryParts.push(`name contains '${escaped}'`);
  }

  const q = queryParts.join(' and ');
  const pageSize = options?.pageSize || 40;

  const url = new URL('https://www.googleapis.com/drive/v3/files');
  url.searchParams.set('q', q);
  url.searchParams.set('pageSize', pageSize.toString());
  url.searchParams.set(
    'fields',
    'files(id, name, mimeType, size, modifiedTime, webViewLink, webContentLink, iconLink, thumbnailLink, owners, starred, trashed)'
  );
  url.searchParams.set('orderBy', 'folder,modifiedTime desc');

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Google Drive API error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  return (data.files || []) as GoogleDriveFile[];
};

/**
 * Create a new folder in Google Drive (e.g., 'FedEx Shipping Documents').
 */
export const createDriveFolder = async (
  folderName: string,
  parentFolderId?: string
): Promise<GoogleDriveFile> => {
  const token = await getAccessToken();
  if (!token) {
    throw new Error('Authentication required: No active Google Drive access token in memory.');
  }

  const metadata: any = {
    name: folderName,
    mimeType: 'application/vnd.google-apps.folder',
  };

  if (parentFolderId) {
    metadata.parents = [parentFolderId];
  }

  const response = await fetch('https://www.googleapis.com/drive/v3/files', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(metadata),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to create Drive folder (${response.status}): ${errorText}`);
  }

  return (await response.json()) as GoogleDriveFile;
};

/**
 * Upload a text or JSON or PDF document to Google Drive using multipart upload.
 */
export const uploadFileToDrive = async (params: {
  fileName: string;
  content: string;
  mimeType?: string;
  parentFolderId?: string;
}): Promise<GoogleDriveFile> => {
  const token = await getAccessToken();
  if (!token) {
    throw new Error('Authentication required: No active Google Drive access token in memory.');
  }

  const mimeType = params.mimeType || 'text/plain';
  const boundary = '-------314159265358979323846';
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelimiter = `\r\n--${boundary}--`;

  const metadata: any = {
    name: params.fileName,
    mimeType,
  };

  if (params.parentFolderId) {
    metadata.parents = [params.parentFolderId];
  }

  const multipartRequestBody =
    delimiter +
    'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
    JSON.stringify(metadata) +
    delimiter +
    `Content-Type: ${mimeType}\r\n\r\n` +
    params.content +
    closeDelimiter;

  const response = await fetch(
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': `multipart/related; boundary=${boundary}`,
      },
      body: multipartRequestBody,
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to upload file to Google Drive (${response.status}): ${errorText}`);
  }

  return (await response.json()) as GoogleDriveFile;
};

/**
 * Delete a file or folder from Google Drive.
 * (MUST be called with explicit user confirmation in UI).
 */
export const deleteDriveFile = async (fileId: string): Promise<void> => {
  const token = await getAccessToken();
  if (!token) {
    throw new Error('Authentication required: No active Google Drive access token in memory.');
  }

  const response = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to delete file from Google Drive (${response.status}): ${errorText}`);
  }
};

/**
 * Helper to generate a standardized FedEx International Air Waybill document.
 */
export const generateFedExAWBText = (shipment: Shipment): string => {
  return `================================================================================
FEDEX EXPRESS & GLOBAL FREIGHT — OFFICIAL INTERNATIONAL AIR WAYBILL (AWB)
Document Type: Commercial Cargo Manifest & Customs Declaration
Tracking / Consignment No: ${shipment.trackingNumber}
Status: ${shipment.status.toUpperCase()}
Generated: ${new Date().toISOString()}
================================================================================

1. ROUTING & TRANSIT NODES
--------------------------------------------------------------------------------
Origin Station:      ${shipment.sender.city}, ${shipment.sender.country} (${shipment.assignedFacility || 'Memphis SuperHub (MEM)'})
Destination Station: ${shipment.recipient.city}, ${shipment.recipient.country} (${shipment.recipient.state || 'Gateway'})
Estimated Delivery:  ${new Date(shipment.estimatedDelivery).toUTCString()}
Primary SuperHub:    Memphis World SuperHub (MEM) / Paris CDG / Guangzhou CAN

2. SHIPPER / CONSIGNOR
--------------------------------------------------------------------------------
Name / Entity:       ${shipment.sender.name}
Company:             ${shipment.sender.company || 'Enterprise Shipper'}
Address:             ${shipment.sender.address}
City / Country:      ${shipment.sender.city}, ${shipment.sender.country} (${shipment.sender.postalCode})
Phone / Emergency:   ${shipment.sender.phone}

3. CONSIGNEE / RECIPIENT
--------------------------------------------------------------------------------
Name / Entity:       ${shipment.recipient.name}
Company:             ${shipment.recipient.company || 'Authorized Consignee'}
Address:             ${shipment.recipient.address}
City / Country:      ${shipment.recipient.city}, ${shipment.recipient.country} (${shipment.recipient.postalCode})
Phone:               ${shipment.recipient.phone}

4. COMMODITY & PALLET SPECIFICATIONS
--------------------------------------------------------------------------------
Packaging Type:      ${shipment.packageInfo.type}
Total Gross Weight:  ${shipment.packageInfo.weight} kg
Dimensions:          ${shipment.packageInfo.length} x ${shipment.packageInfo.width} x ${shipment.packageInfo.height} cm
Total Pieces:        ${shipment.packageInfo.pieces}
Declared Value:      $${shipment.packageInfo.declaredValue.toLocaleString()} USD
Contents Summary:    ${shipment.packageInfo.description}
Service Tier:        FedEx ${shipment.service} Express Priority
Assigned Facility:   ${shipment.assignedFacility || 'MEM-SUPERHUB-01'}
Assigned Driver:     ${shipment.assignedDriver || 'Courier Team Lead'}

6. CUSTOMS CLEARANCE & COMPLIANCE CERTIFICATION
--------------------------------------------------------------------------------
Declared For Customs: YES
Commercial Invoice:   ATTACHED
Dangerous Goods:      INSPECTED & CLEARED FOR AIR FREIGHT
Carrier Signature:    FedEx Express Flight Operations Dispatch Command
Verification Node:    MEM-WORLD-SUPERHUB-CARGO-DISPATCH-99
================================================================================
`;
};
