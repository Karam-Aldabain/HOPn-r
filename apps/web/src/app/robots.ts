import type { MetadataRoute } from "next";
import { fetchCmsServer, normalizeSingle } from "@/lib/cms-server";

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

export default async function robots(): Promise<MetadataRoute.Robots> {
  const baseUrl = await getSiteUrl();
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: baseUrl ? `${baseUrl}/sitemap.xml` : undefined,
  };
}
