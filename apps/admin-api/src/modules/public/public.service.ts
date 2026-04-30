import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class PublicService {
  constructor(private readonly prisma: PrismaService) {}

  listPages() {
    return this.prisma.page.findMany({
      where: { status: "PUBLISHED" },
      include: { sections: { orderBy: { order: "asc" } } },
      orderBy: { title: "asc" },
    });
  }

  getPageBySlug(slug: string) {
    return this.prisma.page.findFirst({
      where: { slug, status: "PUBLISHED" },
      include: { sections: { orderBy: { order: "asc" } } },
    });
  }

  listSolutions(visible?: boolean) {
    return this.prisma.solution.findMany({
      where: typeof visible === "boolean" ? { visible } : undefined,
      orderBy: { order: "asc" },
    });
  }

  listProjects(params: { published?: boolean; featured?: boolean; industry?: string; tech?: string }) {
    const where: Record<string, any> = {};
    if (typeof params.published === "boolean") where.published = params.published;
    if (typeof params.featured === "boolean") where.featured = params.featured;
    if (params.industry) where.industry = params.industry;
    if (params.tech) where.techTags = { has: params.tech };
    return this.prisma.project.findMany({
      where,
      orderBy: { order: "asc" },
    });
  }

  listPartners(visible?: boolean) {
    return this.prisma.partner.findMany({
      where: typeof visible === "boolean" ? { visible } : undefined,
      orderBy: { order: "asc" },
    });
  }

  listTeam(visible?: boolean) {
    return this.prisma.teamMember.findMany({
      where: typeof visible === "boolean" ? { visible } : undefined,
      orderBy: { order: "asc" },
    });
  }

  listNav() {
    return this.prisma.navItem.findMany({
      where: { visible: true },
      orderBy: [{ location: "asc" }, { order: "asc" }],
    });
  }

  getPartnerSettings() {
    return this.prisma.partnerSettings.findFirst();
  }

  getSetting(key?: string) {
    if (!key) {
      return this.prisma.setting.findMany({ orderBy: { key: "asc" } });
    }
    return this.prisma.setting.findUnique({ where: { key } });
  }
}
