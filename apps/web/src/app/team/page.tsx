import { getPageMetadata } from "@/lib/seo";
import {
  fetchCmsServer,
  normalizeCollection,
  resolveCmsMediaUrl,
} from "@/lib/cms-server";
import TeamPageClient, { TeamMember } from "./TeamPageClient";

export async function generateMetadata() {
  return getPageMetadata("team");
}

type CmsTeamMember = {
  name: string;
  role?: string;
  bio?: string;
  linkedin_url?: string;
  linkedinUrl?: string;
  photo?: { url?: string } | string | null;
};

export default async function TeamPage() {
  const res = await fetchCmsServer<any>("/team?visible=true");
  const raw = res?.data ?? [];
  const items = Array.isArray(raw)
    ? (raw as CmsTeamMember[])
    : normalizeCollection<CmsTeamMember>({ data: raw } as any);

  const cmsTeam: TeamMember[] = items.map((m) => {
    const rawPhoto = (m as any).photo;
    const photoUrl = resolveCmsMediaUrl(
      typeof rawPhoto === "string" ? rawPhoto : rawPhoto?.url || ""
    );
    return {
      name: m.name || "Team Member",
      role: m.role || "Team Member",
      bio: m.bio || "Bio coming soon.",
      image: photoUrl || "/team/ebada.jpg",
      linkedin: (m as any).linkedin_url || (m as any).linkedinUrl || "#",
      email: "info@hopn.com",
      highlights: [],
    };
  });

  return <TeamPageClient cmsTeam={cmsTeam} />;
}
