import { getPageMetadata } from "@/lib/seo";
import PartnersPageClient from "./PartnersPageClient";

export async function generateMetadata() {
  return getPageMetadata("partnerships");
}

export default function PartnershipsPage() {
  return <PartnersPageClient />;
}
