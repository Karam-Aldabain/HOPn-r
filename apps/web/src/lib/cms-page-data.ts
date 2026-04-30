import { fetchCms, normalizeSingle } from "@/lib/cms-client";
import { fetchCmsServer } from "@/lib/cms-server";

export type PageData<T> = {
  key: string;
  valueJson?: T;
};

const keyFor = (slug: string) => `page_${slug}`;

export async function getPageDataServer<T>(
  slug: string,
  fallback: T
): Promise<T> {
  const key = keyFor(slug);
  const res = await fetchCmsServer<PageData<T>>(
    `/settings/public?key=${encodeURIComponent(key)}`
  ).catch(() => null);
  const data = normalizeSingle<PageData<T>>(res as any);
  return (data?.valueJson as T) ?? fallback;
}

export async function getPageDataClient<T>(
  slug: string,
  fallback: T
): Promise<T> {
  const key = keyFor(slug);
  const res = await fetchCms<PageData<T>>(
    `/settings/public?key=${encodeURIComponent(key)}`
  ).catch(() => null);
  const data = normalizeSingle<PageData<T>>(res as any);
  return (data?.valueJson as T) ?? fallback;
}
