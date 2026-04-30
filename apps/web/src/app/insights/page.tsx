import { getPageMetadata } from "@/lib/seo";
import InsightsPageClient from "./InsightsPageClient";
import { fetchCmsServer, normalizeCollection, resolveCmsMediaUrl } from "@/lib/cms-server";

type InsightCategory =
  | "Artificial Intelligence"
  | "Emerging Technologies"
  | "Sustainability & Tech"
  | "Digital Transformation"
  | "Innovation & Startups";

type InsightArticle = {
  id: string;
  category: InsightCategory;
  title: string;
  shortDescription: string;
  featuredImage: { src: string; alt: string };
  authorName: string;
  authorRole?: string;
  publishDate: string;
  slug: string;
  tags?: string[];
  viewCount?: number;
  isEditorsPick?: boolean;
};

type CmsInsight = {
  id?: number | string;
  title?: string;
  slug?: string;
  publishDate?: string;
  publishedAt?: string;
  date?: string;
  category?: string;
  shortDescription?: string;
  summary?: string;
  excerpt?: string;
  description?: string;
  authorName?: string;
  authorRole?: string;
  author?: { name?: string; role?: string } | string;
  tags?: string[] | string;
  viewCount?: number;
  isEditorsPick?: boolean;
  featuredImage?: { url?: string; alternativeText?: string; alt?: string } | string;
  image?: { url?: string; alternativeText?: string; alt?: string } | string;
  cover?: { url?: string; alternativeText?: string; alt?: string } | string;
};

const CATEGORY_MAP: Record<string, InsightCategory> = {
  "artificial intelligence": "Artificial Intelligence",
  ai: "Artificial Intelligence",
  "emerging technologies": "Emerging Technologies",
  "sustainability & tech": "Sustainability & Tech",
  "sustainability and tech": "Sustainability & Tech",
  sustainability: "Sustainability & Tech",
  "digital transformation": "Digital Transformation",
  "innovation & startups": "Innovation & Startups",
  "innovation and startups": "Innovation & Startups",
  innovation: "Innovation & Startups",
  startups: "Innovation & Startups",
};

function toCategory(value?: string): InsightCategory {
  if (!value) return "Emerging Technologies";
  const key = value.trim().toLowerCase();
  return CATEGORY_MAP[key] || "Emerging Technologies";
}

function toTags(value?: string[] | string): string[] | undefined {
  if (!value) return undefined;
  if (Array.isArray(value)) return value.filter(Boolean);
  return value
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

function toSlug(input?: string, fallback?: string) {
  const base = (input || fallback || "insight").toString();
  return base
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function fallbackImage(category: InsightCategory) {
  if (category === "Artificial Intelligence") {
    return { src: "/insights-ai.webp", alt: "Abstract AI and enterprise technology" };
  }
  if (category === "Emerging Technologies") {
    return { src: "/insights-api.webp", alt: "Emerging technologies concept visual" };
  }
  return { src: "/insights-cyber.jpeg", alt: "Sustainability and digital innovation" };
}

export async function generateMetadata() {
  return getPageMetadata("insights");
}

export default async function InsightsPage() {
  const res = await fetchCmsServer<CmsInsight[]>("/insights?published=true").catch(() => null);
  const items = res ? normalizeCollection<CmsInsight>(res as any) : [];

  const cmsInsights = items
    .map((item): InsightArticle | null => {
      const category = toCategory(item.category);
      const title = item.title?.toString().trim() || "";
      const authorName =
        item.authorName?.toString().trim() ||
        (typeof item.author === "string" ? item.author : item.author?.name) ||
        "";
      const authorRole =
        item.authorRole?.toString().trim() ||
        (typeof item.author === "object" ? item.author?.role : undefined);
      const publishDate =
        item.publishDate || item.publishedAt || item.date || "";
      const shortDescription =
        item.shortDescription ||
        item.summary ||
        item.excerpt ||
        item.description ||
        "";
      const imageRaw = item.featuredImage || item.image || item.cover;
      const imageUrl =
        typeof imageRaw === "string"
          ? imageRaw
          : imageRaw?.url || "";
      const imageAlt =
        typeof imageRaw === "object"
          ? imageRaw?.alternativeText || imageRaw?.alt
          : undefined;
      const resolvedImage = imageUrl
        ? {
            src: resolveCmsMediaUrl(imageUrl),
            alt: imageAlt || title,
          }
        : fallbackImage(category);
      const slug = item.slug || (title ? toSlug(title, String(item.id ?? "insight")) : "");

      if (!title || !shortDescription || !authorName || !slug) {
        return null;
      }

      return {
        id: String(item.id ?? slug),
        category,
        title,
        shortDescription: shortDescription.toString().trim(),
        featuredImage: resolvedImage,
        authorName,
        authorRole,
        publishDate,
        slug,
        tags: toTags(item.tags),
        viewCount: typeof item.viewCount === "number" ? item.viewCount : undefined,
        isEditorsPick: item.isEditorsPick ?? undefined,
      };
    })
    .filter(Boolean) as InsightArticle[];

  return <InsightsPageClient cmsInsights={cmsInsights} />;
}
