import CmsPageView from "@/components/cms/CmsPageView";
import { getPageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  return getPageMetadata(params.slug);
}

export default async function CmsPage({ params }: { params: { slug: string } }) {
  return <CmsPageView slug={params.slug} />;
}
