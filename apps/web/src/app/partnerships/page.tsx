import CmsPageView, { buildCmsMetadata } from "@/components/cms/CmsPageView";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return buildCmsMetadata("partnerships");
}

export default async function PartnershipsPage() {
  return <CmsPageView slug="partnerships" />;
}
