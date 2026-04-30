import SectionRenderer from "@/components/cms/SectionRenderer";
import {
  fetchCmsServer,
  normalizeCollection,
  normalizeSingle,
  resolveCmsMediaUrl,
} from "@/lib/cms-server";
import type { Metadata } from "next";

type CmsPage = {
  title?: string;
  slug?: string;
  seoTitle?: string;
  seoDescription?: string;
  ogImage?: string;
  sections?: any[];
};

type CmsProject = {
  id?: number;
  title?: string;
  short_desc?: string;
  shortDesc?: string;
  industry?: string;
  tech_tags?: string[];
  techTags?: string[];
  cover_image?: { url?: string };
  coverImage?: string;
  external_url?: string;
  externalUrl?: string;
};

type CmsPartner = {
  id?: number;
  name?: string;
  description?: string;

  partnership_type?: string;
  partnershipType?: string;

  // backend can return either: { url }, or a raw string URL, or null
  logo?: { url?: string } | string | null;

  url?: string;
};

type CmsTeamMember = {
  id?: number;
  name?: string;
  role?: string;
  bio?: string;

  // backend can return either: { url }, or a raw string URL, or null
  photo?: { url?: string } | string | null;
};

type CmsSolution = {
  id?: number;
  title?: string;
  description?: string;
  caseSnippet?: string | null;
  bulletsProblems?: string[];
  bulletsDeliverables?: string[];
  icon?: string | null;
  ctaLabel?: string | null;
  ctaUrl?: string | null;
  visible?: boolean;
  order?: number;
};

type PartnerSettings = {
  displayMode?: "carousel" | "grid";
  carouselSpeed?: number;
};

type SeoDefaults = {
  title?: string;
  description?: string;
  ogImage?: string;
  siteUrl?: string; // optional
};

function isAbs(url?: string) {
  return !!url && /^https?:\/\//i.test(url);
}

function slugCandidatesFrom(slug: string | string[] | undefined): string[] {
  if (!slug) return ["home", ""];
  if (Array.isArray(slug)) {
    const joined = slug.filter(Boolean).join("/");
    // Try full joined path first, then last segment, then each segment
    const last = slug[slug.length - 1];
    return [joined, last, ...slug].filter(Boolean);
  }
  return [slug];
}

function normalizeSections(page: CmsPage | null): CmsPage | null {
  if (!page) return null;
  const sections = Array.isArray(page.sections) ? page.sections : [];
  page.sections = sections.map((s: any) => ({
    ...s,
    type: s.type,
    visible: s.visible ?? true,
    order: s.order ?? 0,
    content_json: s.content_json ?? s.contentJson ?? {},
  }));
  return page;
}

// Legal fallback:
// - try /settings/public?key=legal_${slug}
// - else try /settings/public?key=legal_pages { [slug]: {title, body} }
async function getLegalFallback(slug: string): Promise<CmsPage | null> {
  const byKey = await fetchCmsServer<any>(`/settings/public?key=legal_${encodeURIComponent(slug)}`).catch(() => null);
  const one = normalizeSingle<any>(byKey as any);
  const v1 = one?.valueJson;
  if (v1?.title || v1?.body) {
    return {
      title: v1.title || slug,
      slug,
      sections: [
        { type: "HeroBlock", visible: true, order: 0, content_json: { title: v1.title || slug, subtitle: "" } },
        { type: "RichTextBlock", visible: true, order: 1, content_json: { title: "", body: v1.body || "" } },
      ],
    };
  }

  const all = await fetchCmsServer<any>(`/settings/public?key=legal_pages`).catch(() => null);
  const allN = normalizeSingle<any>(all as any);
  const v2 = allN?.valueJson?.[slug];
  if (v2?.title || v2?.body) {
    return {
      title: v2.title || slug,
      slug,
      sections: [
        { type: "HeroBlock", visible: true, order: 0, content_json: { title: v2.title || slug, subtitle: "" } },
        { type: "RichTextBlock", visible: true, order: 1, content_json: { title: "", body: v2.body || "" } },
      ],
    };
  }

  return null;
}

async function getSeoDefaults(): Promise<SeoDefaults> {
  // prefer explicit seo_defaults, fallback to site settings if you store it there
  const [seoRes, siteRes] = await Promise.all([
    fetchCmsServer<any>(`/settings/public?key=seo_defaults`).catch(() => null),
    fetchCmsServer<any>(`/settings/public?key=site`).catch(() => null),
  ]);

  const seo = normalizeSingle<any>(seoRes as any)?.valueJson;
  const site = normalizeSingle<any>(siteRes as any)?.valueJson;

  const seoDefaults: SeoDefaults = {
    title: seo?.title ?? site?.seo_defaults?.title ?? site?.brand_name ?? "Website",
    description: seo?.description ?? site?.seo_defaults?.description ?? site?.tagline ?? "",
    ogImage: seo?.ogImage ?? site?.seo_defaults?.ogImage ?? site?.ogImage ?? "",
    siteUrl: seo?.siteUrl ?? site?.site_url ?? site?.siteUrl ?? process.env.NEXT_PUBLIC_SITE_URL,
  };

  return seoDefaults;
}

function inferNeeds(pageSlug: string, sections: any[]) {
  const set = new Set<string>((sections || []).map((s) => s?.type).filter(Boolean));

  const wantsSolutions = set.has("SolutionsListBlock") || set.has("Solutions") || pageSlug === "solutions";
  const wantsProjects =
    set.has("ProjectsGridBlock") || set.has("ProjectsPreviewBlock") || set.has("Projects") || pageSlug === "projects";
  const wantsPartners =
    set.has("PartnersCarouselBlock") || set.has("Partners") || pageSlug === "partnerships" || pageSlug === "partners";
  const wantsTeam = set.has("TeamGridBlock") || set.has("Team") || pageSlug === "about" || pageSlug === "team";
  const wantsPartnerSettings = wantsPartners;

  return { wantsSolutions, wantsProjects, wantsPartners, wantsTeam, wantsPartnerSettings };
}

// Minimal “template” if a page exists but has no sections configured yet
function templateSectionsFor(slug: string): any[] | null {
  if (slug === "solutions") {
    return [
      { type: "HeroBlock", visible: true, order: 0, content_json: { title: "Solutions", subtitle: "" } },
      { type: "SolutionsListBlock", visible: true, order: 1, content_json: { title: "Solutions", subtitle: "" } },
    ];
  }
  if (slug === "projects") {
    return [
      { type: "HeroBlock", visible: true, order: 0, content_json: { title: "Projects", subtitle: "" } },
      { type: "ProjectsGridBlock", visible: true, order: 1, content_json: { title: "", subtitle: "", showFilters: true } },
    ];
  }
  if (slug === "partnerships" || slug === "partners") {
    return [
      { type: "HeroBlock", visible: true, order: 0, content_json: { title: "Partnerships", subtitle: "" } },
      { type: "PartnersCarouselBlock", visible: true, order: 1, content_json: { title: "Partners", subtitle: "" } },
    ];
  }
  if (slug === "about") {
    return [
      { type: "HeroBlock", visible: true, order: 0, content_json: { title: "About", subtitle: "" } },
      { type: "RichTextBlock", visible: true, order: 1, content_json: { title: "About", body: "" } },
      { type: "RichTextBlock", visible: true, order: 2, content_json: { title: "Mission", body: "" } },
      { type: "RichTextBlock", visible: true, order: 3, content_json: { title: "Vision", body: "" } },
      { type: "TeamGridBlock", visible: true, order: 4, content_json: { title: "Team", subtitle: "" } },
      { type: "ContactFormBlock", visible: true, order: 5, content_json: { title: "Contact", subtitle: "" } },
    ];
  }
  return null;
}

export async function getCmsPage(slug: string | string[] | undefined): Promise<CmsPage | null> {
  const candidates = slugCandidatesFrom(slug);

  for (const candidate of candidates) {
    const res = await fetchCmsServer<CmsPage>(`/pages/${candidate}`).catch(() => null);
    const normalized = normalizeSingle<CmsPage>(res as any);
    if (normalized) {
      return normalizeSections(normalized);
    }
  }

  // legal fallback (common: /privacy, /cookies, /imprint, /terms)
  const last = candidates[0] || candidates[candidates.length - 1] || "";
  if (last) {
    const legal = await getLegalFallback(last);
    if (legal) return normalizeSections(legal);
  }

  return null;
}

export async function buildCmsMetadata(slug: string | string[] | undefined): Promise<Metadata> {
  const [page, defaults] = await Promise.all([getCmsPage(slug), getSeoDefaults()]);

  const title = (page?.seoTitle || page?.title || defaults.title || "Website").trim();
  const description = (page?.seoDescription || defaults.description || "").trim();

  const og = page?.ogImage || defaults.ogImage || "";
  const ogResolved = og ? (isAbs(og) ? og : resolveCmsMediaUrl(og)) : "";

  const base = defaults.siteUrl ? new URL(defaults.siteUrl) : undefined;

  // canonical: treat "home" as "/"
  const pageSlug = (Array.isArray(slug) ? slug.join("/") : slug) || page?.slug || "";
  const canonicalPath = pageSlug === "home" || pageSlug === "" ? "/" : `/${pageSlug}`;

  return {
    metadataBase: base,
    title,
    description,
    alternates: { canonical: canonicalPath },
    openGraph: {
      title,
      description,
      url: canonicalPath,
      images: ogResolved ? [{ url: ogResolved }] : undefined,
    },
    twitter: {
      card: ogResolved ? "summary_large_image" : "summary",
      title,
      description,
      images: ogResolved ? [ogResolved] : undefined,
    },
  };
}

export default async function CmsPageView({ slug }: { slug: string | string[] | undefined }) {
  let page = await getCmsPage(slug);
  const overrideSlug = slugCandidatesFrom(slug)[0] || "";
  if (overrideSlug) {
    const overrideRes = await fetchCmsServer<any>(
      `/settings/public?key=page_${encodeURIComponent(overrideSlug)}`
    ).catch(() => null);
    const override = normalizeSingle<any>(overrideRes as any)?.valueJson;
    if (override?.sections?.length) {
      page = normalizeSections({
        title: override.title ?? page?.title ?? overrideSlug,
        slug: override.slug ?? overrideSlug,
        seoTitle: override.seoTitle ?? page?.seoTitle,
        seoDescription: override.seoDescription ?? page?.seoDescription,
        ogImage: override.ogImage ?? page?.ogImage,
        sections: override.sections,
      });
    }
  }

  if (!page) {
    const candidates = slugCandidatesFrom(slug);
    const fallbackSlug = candidates[0] || "";
    const templ = fallbackSlug ? templateSectionsFor(fallbackSlug) : null;
    if (templ?.length) {
      page = normalizeSections({
        title: fallbackSlug,
        slug: fallbackSlug,
        sections: templ,
      });
    } else {
      return (
        <main className="relative min-h-screen bg-[hsl(var(--bg))] text-[hsl(var(--fg))]">
          <section className="relative z-10 pt-16 sm:pt-20 pb-10 border-b border-[hsl(var(--border))]">
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
              <h1 className="text-3xl sm:text-4xl font-black">Page not configured yet</h1>
              <p className="mt-4 text-[hsl(var(--muted))]">
                Create a Page in the CMS with one of these slugs: {candidates.join(", ")}.
              </p>
            </div>
          </section>
          <div className="relative z-10 h-10" />
        </main>
      );
    }
  }

  // If page exists but sections empty, apply a template (optional)
  if (page && !page.sections?.length && page.slug) {
    const templ = templateSectionsFor(page.slug);
    if (templ?.length) page.sections = templ;
  }

  const resolvedPage = page!;
  const pageSlug = resolvedPage.slug || (Array.isArray(slug) ? slug.join("/") : slug) || "";
  const needs = inferNeeds(pageSlug, resolvedPage.sections || []);

  const [projectsRes, partnersRes, teamRes, solutionsRes, partnerSettingsRes] = await Promise.all([
    needs.wantsProjects ? fetchCmsServer<CmsProject[]>(`/projects?published=true`) : Promise.resolve(null),
    needs.wantsPartners ? fetchCmsServer<CmsPartner[]>(`/partners?visible=true`) : Promise.resolve(null),
    needs.wantsTeam ? fetchCmsServer<CmsTeamMember[]>(`/team?visible=true`) : Promise.resolve(null),
    needs.wantsSolutions ? fetchCmsServer<CmsSolution[]>(`/solutions?visible=true`) : Promise.resolve(null),
    needs.wantsPartnerSettings ? fetchCmsServer<PartnerSettings>(`/partners/settings`) : Promise.resolve(null),
  ]);

  const projects = projectsRes
    ? normalizeCollection<CmsProject>(projectsRes).map((p: any) => ({
        ...p,
        short_desc: p.short_desc ?? p.shortDesc,
        tech_tags: p.tech_tags ?? p.techTags ?? [],
        external_url: p.external_url ?? p.externalUrl ?? p.url ?? null,
        cover_image: p.cover_image?.url
          ? { url: resolveCmsMediaUrl(p.cover_image.url) }
          : p.coverImage
          ? { url: resolveCmsMediaUrl(p.coverImage) }
          : undefined,
      }))
    : [];

  const partners = partnersRes
    ? normalizeCollection<CmsPartner>(partnersRes).map((p: any) => {
        const rawLogo = p.logo;
        const logoUrl = typeof rawLogo === "string" ? rawLogo : rawLogo?.url;

        return {
          ...p,
          partnership_type: p.partnership_type ?? p.partnershipType,
          logo: logoUrl ? { url: resolveCmsMediaUrl(logoUrl) } : undefined,
        };
      })
    : [];

  const team = teamRes
    ? normalizeCollection<CmsTeamMember>(teamRes).map((m: any) => {
        const rawPhoto = m.photo;
        const photoUrl = typeof rawPhoto === "string" ? rawPhoto : rawPhoto?.url;

        return {
          ...m,
          photo: photoUrl ? { url: resolveCmsMediaUrl(photoUrl) } : undefined,
        };
      })
    : [];

  const solutions = solutionsRes
    ? normalizeCollection<CmsSolution>(solutionsRes).map((s: any) => ({ ...s, order: s.order ?? 0 }))
    : [];

  const partnerSettings =
    (partnerSettingsRes ? normalizeSingle<PartnerSettings>(partnerSettingsRes) : null) || {
      displayMode: "carousel",
      carouselSpeed: 30,
    };

  return (
    <main className="relative min-h-screen bg-[hsl(var(--bg))] text-[hsl(var(--fg))]">
      <SectionRenderer
        sections={resolvedPage.sections || []}
        projects={projects}
        partners={partners}
        team={team}
        solutions={solutions}
        partnerSettings={partnerSettings}
      />
      <div className="relative z-10 h-10" />
    </main>
  );
}
