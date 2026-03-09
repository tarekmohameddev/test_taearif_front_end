import axiosInstance from "@/lib/axiosInstance";

const BASE = "/v1/whatsapp";

function getData<T>(res: {
  data?: { status?: string | boolean; data?: T; message?: string };
  status: number;
}): T {
  const body = res.data;
  const msg = (body as { message?: string })?.message ?? "Request failed";
  if (
    body?.status === "error" ||
    body?.status === false ||
    res.status >= 400
  ) {
    throw new Error(msg);
  }
  return (body?.data ?? body) as T;
}

// --- Backend types (approximate; keep flexible for mapping layer) ---

export interface ApiWhatsAppTemplate {
  id: number | string;
  name?: string | null;
  content?: string | null;
  category?: string | null;
  variables?: string[] | null;
  [key: string]: unknown;
}

export async function listWhatsAppTemplates(): Promise<ApiWhatsAppTemplate[]> {
  const res = await axiosInstance.get(`${BASE}/templates`);
  const raw = getData<ApiWhatsAppTemplate[] | { data?: ApiWhatsAppTemplate[] }>(
    res
  );
  if (Array.isArray(raw)) {
    return raw;
  }
  return (raw as { data?: ApiWhatsAppTemplate[] })?.data ?? [];
}

export async function getWhatsAppTemplateApi(
  id: string
): Promise<ApiWhatsAppTemplate> {
  const res = await axiosInstance.get(`${BASE}/templates/${id}`);
  return getData<ApiWhatsAppTemplate>(res);
}

export async function createWhatsAppTemplateApi(
  body: Record<string, unknown>
): Promise<ApiWhatsAppTemplate> {
  const res = await axiosInstance.post(`${BASE}/templates`, body);
  return getData<ApiWhatsAppTemplate>(res);
}

export async function updateWhatsAppTemplateApi(
  id: string,
  body: Record<string, unknown>
): Promise<ApiWhatsAppTemplate> {
  const res = await axiosInstance.put(`${BASE}/templates/${id}`, body);
  return getData<ApiWhatsAppTemplate>(res);
}

export async function deleteWhatsAppTemplateApi(id: string): Promise<void> {
  const res = await axiosInstance.delete(`${BASE}/templates/${id}`);
  getData<unknown>(res);
}

