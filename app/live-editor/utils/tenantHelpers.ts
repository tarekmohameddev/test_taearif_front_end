/**
 * إنشاء URL كامل مع tenantId.domain.com
 * في التطوير: tenantId.localhost:3000
 * في الإنتاج: tenantId.domain.com
 */
export function getTenantUrl(tenantId: string, path: string = ""): string {
  if (!tenantId) return path;

  const isDevelopment = process.env.NODE_ENV === "development";
  const domain = isDevelopment ? "localhost:3000" : "taearif.com";

  return `http${isDevelopment ? "" : "s"}://${tenantId}.${domain}${path}`;
}
