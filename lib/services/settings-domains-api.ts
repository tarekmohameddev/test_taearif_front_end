/**
 * Settings Domains API — single source for all domain-related endpoints.
 * Prevents duplicate API definitions; use this from hooks only.
 */
import axiosInstance from "@/lib/axiosInstance";
import type { Domain, DnsInstructions } from "@/components/settings/types";

const BASE = "/settings/domain";

// --- In-flight request deduplication (PREVENT_DUPLICATE_API) ---
const inFlight = new Map<string, Promise<unknown>>();

function dedupeByKey<T>(key: string, fn: () => Promise<T>): Promise<T> {
  const existing = inFlight.get(key);
  if (existing) return existing as Promise<T>;
  const promise = fn().finally(() => inFlight.delete(key));
  inFlight.set(key, promise);
  return promise;
}

export interface GetDomainsResponse {
  domains: Domain[];
  dnsInstructions: DnsInstructions | null;
}

export interface AddDomainResponse {
  data: Domain;
}

export interface VerifyDomainResponse {
  data: Domain;
}

/** GET /settings/domain — list domains and DNS instructions */
export async function getDomains(): Promise<GetDomainsResponse> {
  return dedupeByKey("domains", async () => {
    const response = await axiosInstance.get<{
      domains?: Domain[];
      dnsInstructions?: DnsInstructions | null;
    }>(BASE);
    return {
      domains: response.data.domains ?? [],
      dnsInstructions: response.data.dnsInstructions ?? null,
    };
  });
}

/** POST /settings/domain — add a custom domain */
export async function addDomain(customName: string): Promise<AddDomainResponse> {
  const response = await axiosInstance.post<{ data: Domain }>(BASE, {
    custom_name: customName,
  });
  return response.data;
}

/** POST /settings/domain/verify — verify a domain */
export async function verifyDomain(
  domainId: string,
): Promise<VerifyDomainResponse> {
  const response = await axiosInstance.post<{ data: Domain }>(
    `${BASE}/verify`,
    { id: domainId },
  );
  return response.data;
}

/** POST /settings/domain/set-primary — set primary domain */
export async function setPrimaryDomain(
  domainId: string,
): Promise<void> {
  await axiosInstance.post(`${BASE}/set-primary`, { id: domainId });
}

/** DELETE /settings/domain/:id — delete a domain */
export async function deleteDomain(domainId: string): Promise<void> {
  await axiosInstance.delete(`${BASE}/${domainId}`);
}
