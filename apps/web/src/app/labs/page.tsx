import { getPageMetadata } from "@/lib/seo";
import LabsPageClient, { LabsContent } from "./LabsPageClient";
import { getCmsPage } from "@/components/cms/CmsPageView";
import { getPageDataServer } from "@/lib/cms-page-data";

export async function generateMetadata() {
  return getPageMetadata("labs");
}

export default async function LabsPage() {
  const page = await getCmsPage("labs");
  const sections = page?.sections || [];
  const labsSection = sections.find((s: any) =>
    ["LabsPage", "LabsPageBlock", "LabsPageSection"].includes(s?.type)
  );
  const content = (labsSection as any)?.content_json ?? (labsSection as any)?.contentJson ?? null;

  const settings = await getPageDataServer<LabsContent>("labs", {} as LabsContent);
  const hasSettings = settings && Object.keys(settings).length > 0;

  return <LabsPageClient content={hasSettings ? settings : content} />;
}
