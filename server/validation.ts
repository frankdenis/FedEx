import type { AddressInfo, PackageInfo, ServiceTier } from '../src/types';

const services: ServiceTier[] = ['Express', 'Priority', 'Standard', 'Freight'];

export function assertAddress(value: unknown, field: string): asserts value is AddressInfo {
  if (!value || typeof value !== 'object') throw new Error(`${field} is required.`);
  const address = value as Record<string, unknown>;
  for (const key of ['name', 'address', 'city', 'postalCode', 'country', 'phone']) {
    if (typeof address[key] !== 'string' || !String(address[key]).trim()) throw new Error(`${field}.${key} is required.`);
  }
}

export function assertPackage(value: unknown): asserts value is PackageInfo {
  if (!value || typeof value !== 'object') throw new Error('packageInfo is required.');
  const pkg = value as Record<string, unknown>;
  if (typeof pkg.weight !== 'number' || pkg.weight <= 0) throw new Error('packageInfo.weight must be greater than zero.');
  if (typeof pkg.length !== 'number' || pkg.length <= 0 || typeof pkg.width !== 'number' || pkg.width <= 0 || typeof pkg.height !== 'number' || pkg.height <= 0) throw new Error('Package dimensions must be positive numbers.');
  if (typeof pkg.pieces !== 'number' || pkg.pieces < 1) throw new Error('packageInfo.pieces must be at least 1.');
}

export function assertService(value: unknown): asserts value is ServiceTier {
  if (!services.includes(value as ServiceTier)) throw new Error('Unsupported service tier.');
}
