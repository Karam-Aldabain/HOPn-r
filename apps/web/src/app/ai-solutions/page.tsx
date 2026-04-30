import { getPageMetadata } from "@/lib/seo";
import AiSolutionsPageClient from "./AiSolutionsPageClient";

export async function generateMetadata() {
  return getPageMetadata("ai-solutions");
}

export default function AiSolutionsPage() {
  return <AiSolutionsPageClient />;
}
