import { getPageMetadata } from "@/lib/seo";
import HomePageClient, { HomeContent } from "./HomePageClient";
import { getCmsPage } from "@/components/cms/CmsPageView";
import { fetchCmsServer, normalizeCollection, resolveCmsMediaUrl } from "@/lib/cms-server";
import { getPageDataServer } from "@/lib/cms-page-data";

type CmsPartner = {
  name?: string;
  logo?: { url?: string } | string | null;
};

export async function generateMetadata() {
  return getPageMetadata("home");
}

export default async function HomePage() {
  const page = await getCmsPage("home");
  const sections = page?.sections || [];
  const homeSection = sections.find((s: any) =>
    ["HomePage", "HomePageBlock", "HomePageSection"].includes(s?.type)
  );
  const home = (homeSection as any)?.content_json ?? (homeSection as any)?.contentJson ?? null;

  let cmsPartners: Array<{ name: string; logo?: string }> = [];
  const useCms = home?.partners?.useCms !== false;

  if (useCms) {
    const partnersRes = await fetchCmsServer<CmsPartner[]>(`/partners?visible=true`).catch(() => null);
    if (partnersRes) {
      cmsPartners = normalizeCollection<CmsPartner>(partnersRes)
        .map((p: any) => {
          const rawLogo = p.logo;
          const logoUrl = typeof rawLogo === "string" ? rawLogo : rawLogo?.url;
          return {
            name: p.name,
            logo: logoUrl ? resolveCmsMediaUrl(logoUrl) : undefined,
          };
        })
        .filter((p) => p.name);
    }
  }

  const settings = await getPageDataServer<HomeContent>("home", {} as HomeContent);
  const hasSettings = settings && Object.keys(settings).length > 0;

  return <HomePageClient home={home} settings={hasSettings ? settings : null} cmsPartners={cmsPartners} />;
}
