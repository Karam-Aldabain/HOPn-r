import type { MetadataRoute } from "next";
import { fetchCmsServer, normalizeCollection, normalizeSingle } from "@/lib/cms-server";

type CmsPage = {
  slug?: string;
  updatedAt?: string;
  publishedAt?: string;
};

type SeoDefaults = {
  siteUrl?: string;
};

async function getSiteUrl(): Promise<string | null> {
  const [seoRes, siteRes] = await Promise.all([
    fetchCmsServer<any>("/settings/public?key=seo_defaults").catch(() => null),
    fetchCmsServer<any>("/settings/public?key=site").catch(() => null),
  ]);

  const seo = normalizeSingle<any>(seoRes as any)?.valueJson as SeoDefaults | undefined;
  const site = normalizeSingle<any>(siteRes as any)?.valueJson as any;

  const url =
    seo?.siteUrl ||
    site?.site_url ||
    site?.siteUrl ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    null;

  if (!url) return null;
  return url.replace(/\/$/, "");
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = await getSiteUrl();
  const pagesRes = await fetchCmsServer<CmsPage[]>("/pages").catch(() => null);
  const pages = pagesRes ? normalizeCollection<CmsPage>(pagesRes as any) : [];

  const entries = pages
    .filter((p) => p?.slug)
    .map((p) => {
      const slug = p.slug === "home" ? "" : p.slug;
      const loc = baseUrl ? `${baseUrl}/${slug}`.replace(/\/$/, "/") : `/${slug}`;
      const lastMod = p.updatedAt || p.publishedAt || new Date().toISOString();
      return {
        url: loc,
        lastModified: lastMod,
      };
    });

  // Always include root
  if (baseUrl) {
    entries.unshift({ url: `${baseUrl}/`, lastModified: new Date().toISOString() });
  } else {
    entries.unshift({ url: "/", lastModified: new Date().toISOString() });
  }

  return entries;
}
