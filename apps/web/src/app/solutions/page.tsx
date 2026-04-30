import CmsPageView, { buildCmsMetadata } from "@/components/cms/CmsPageView";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return buildCmsMetadata("solutions");
}

export default async function SolutionsPage() {
  return <CmsPageView slug="solutions" />;
}
