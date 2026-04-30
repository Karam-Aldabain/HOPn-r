import { getPageMetadata } from "@/lib/seo";
import VisionMissionPageClient from "./VisionMissionPageClient";

export async function generateMetadata() {
  return getPageMetadata("vision-mission");
}

export default function VisionMissionPage() {
  return <VisionMissionPageClient />;
}
