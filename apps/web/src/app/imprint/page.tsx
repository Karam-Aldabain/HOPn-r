import CmsPageView, { buildCmsMetadata } from "@/components/cms/CmsPageView";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return buildCmsMetadata("imprint");
}

export default async function ImprintPage() {
  return <CmsPageView slug="imprint" />;
}
