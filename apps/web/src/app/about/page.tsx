import CmsPageView, { buildCmsMetadata } from "@/components/cms/CmsPageView";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return buildCmsMetadata("about");
}

export default async function AboutPage() {
  return <CmsPageView slug="about" />;
}
