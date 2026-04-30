import type { Metadata } from "next";
import { fetchCmsServer, normalizeSingle } from "@/lib/cms-server";

type PageSeo = {
  title?: string;
  seoTitle?: string;
  seoDescription?: string;
  ogImage?: string;
};

export async function getPageMetadata(slug: string): Promise<Metadata> {
  const res = await fetchCmsServer<PageSeo>(`/pages/${slug}`);
  const page = normalizeSingle<PageSeo>(res);
  if (!page) return {};

  const title = page.seoTitle || page.title;
  const description = page.seoDescription;
  const images = page.ogImage ? [page.ogImage] : undefined;

  return {
    title,
    description,
    openGraph: images ? { images } : undefined,
  };
}
