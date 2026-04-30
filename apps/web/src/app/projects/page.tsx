import { getPageMetadata } from "@/lib/seo";
import ProjectsPageClient, { ProjectsPageContent } from "./ProjectsPageClient";
import { getCmsPage } from "@/components/cms/CmsPageView";
import { fetchCmsServer, normalizeCollection, resolveCmsMediaUrl } from "@/lib/cms-server";
import { getPageDataServer } from "@/lib/cms-page-data";

type CmsProject = {
  title?: string;
  short_desc?: string;
  shortDesc?: string;
  industry?: string;
  tech_tags?: string[];
  techTags?: string[];
  cover_image?: { url?: string };
  coverImage?: string;
  url?: string;
  external_url?: string;
  externalUrl?: string;
  featured?: boolean;
};

function resolveProjectImage(url?: string) {
  if (!url) return "";
  if (/^https?:\/\//i.test(url)) return url;
  if (url.startsWith("/uploads")) return resolveCmsMediaUrl(url);
  if (url.startsWith("/")) return url;
  return resolveCmsMediaUrl(url);
}

export async function generateMetadata() {
  return getPageMetadata("projects");
}

export default async function ProjectsPage() {
  const page = await getCmsPage("projects");
  const sections = page?.sections || [];
  const projectsSection = sections.find((s: any) =>
    ["ProjectsPage", "ProjectsPageBlock", "ProjectsPageSection"].includes(s?.type)
  );
  const content = (projectsSection as any)?.content_json ?? (projectsSection as any)?.contentJson ?? null;

  let cmsProjects: Array<{
    name: string;
    desc: string;
    tags: string[];
    category: string;
    image: string;
    href?: string;
    icon?: string;
    featured?: boolean;
  }> = [];

  const useCms = content?.projects?.useCms !== false;
  if (useCms) {
    const res = await fetchCmsServer<CmsProject[]>(`/projects?published=true`).catch(() => null);
    if (res) {
      cmsProjects = normalizeCollection<CmsProject>(res).map((p: any) => {
        const title = p.title || "Project";
        const desc = p.short_desc ?? p.shortDesc ?? "";
        const tags = p.tech_tags ?? p.techTags ?? [];
        const image =
          p.cover_image?.url
            ? resolveProjectImage(p.cover_image.url)
            : p.coverImage
              ? resolveProjectImage(p.coverImage)
              : "/portfolio/market-analysis.avif";
        const category = p.industry || "Project";

        const icon =
          /fintech/i.test(category) ? "dollar" :
          /health/i.test(category) ? "search" :
          /logistic/i.test(category) ? "truck" :
          /ai|analytics/i.test(category) ? "chart" :
          "briefcase";

        return {
          name: title,
          desc,
          tags,
          category,
          image,
          href: p.external_url ?? p.externalUrl ?? p.url,
          featured: !!p.featured,
          icon,
        };
      });
    }
  }

  const settings = await getPageDataServer<ProjectsPageContent>("projects", {} as ProjectsPageContent);
  const hasSettings = settings && Object.keys(settings).length > 0;

  return (
    <ProjectsPageClient
      content={hasSettings ? settings : content}
      cmsProjects={cmsProjects}
    />
  );
}
