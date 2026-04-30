export type CmsResponse<T> = {
  data: T;
  error?: unknown;
};

const RAW_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
export const CMS_BASE_URL = RAW_BASE.replace(/\/$/, "").endsWith("/api")
  ? RAW_BASE.replace(/\/$/, "")
  : `${RAW_BASE.replace(/\/$/, "")}/api`;

export function buildCmsUrl(path: string) {
  const base = CMS_BASE_URL.replace(/\/$/, "");
  return `${base}${path.startsWith("/") ? "" : "/"}${path}`;
}

function getRootBase() {
  return CMS_BASE_URL.replace(/\/api\/?$/, "");
}

export async function fetchCms<T>(path: string): Promise<CmsResponse<T>> {
  try {
    const res = await fetch(buildCmsUrl(path));
    if (!res.ok) {
      return { data: null as unknown as T, error: await res.text() };
    }
    const json = (await res.json()) as any;
    if (json && typeof json === "object" && "data" in json) {
      return json as CmsResponse<T>;
    }
    return { data: json as T };
  } catch (err) {
    return { data: null as unknown as T, error: err };
  }
}

export function normalizeCollection<T>(res: CmsResponse<any>): T[] {
  if (!res?.data) return [];
  if (Array.isArray(res.data)) {
    return res.data.map((item: any) => {
      if (item && typeof item === "object" && "attributes" in item) {
        return { id: item.id, ...(item.attributes || {}) };
      }
      return item;
    }) as T[];
  }
  return [];
}

export function normalizeSingle<T>(res: CmsResponse<any>): T | null {
  if (!res?.data) return null;
  const item = res.data;
  if (item && typeof item === "object" && "attributes" in item) {
    return { id: item.id, ...(item.attributes || {}) } as T;
  }
  return item as T;
}

export function resolveCmsMediaUrl(url?: string) {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  if (url.startsWith("/uploads")) {
    const base = getRootBase().replace(/\/$/, "");
    return `${base}${url}`;
  }
  return buildCmsUrl(url);
}
