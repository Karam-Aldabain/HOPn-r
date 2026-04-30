import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { CreatePageDto } from "./dto/create-page.dto";
import { UpdatePageDto } from "./dto/update-page.dto";
import { UserRole } from "@prisma/client";
import { AuditService } from "../audit/audit.service";

@Injectable()
export class PagesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  findAll() {
    return this.prisma.page.findMany({ include: { sections: true } });
  }

  findOne(id: number) {
    return this.prisma.page.findUnique({ where: { id }, include: { sections: true } });
  }

  async create(dto: CreatePageDto, userId?: number, role?: UserRole) {
    const data = { ...dto } as any;
    if (role === UserRole.EDITOR) {
      data.status = "DRAFT";
      data.publishedAt = null;
    }
    const page = await this.prisma.page.create({ data });
    await this.audit.create({
      entityType: "Page",
      entityId: String(page.id),
      action: "create",
      diffJson: dto,
      changedBy: userId,
    });
    return page;
  }

  async update(id: number, dto: UpdatePageDto, userId?: number, role?: UserRole) {
    const data = { ...dto } as any;
    if (role === UserRole.EDITOR) {
      data.status = "DRAFT";
      data.publishedAt = null;
    }
    const page = await this.prisma.page.update({ where: { id }, data });
    await this.audit.create({
      entityType: "Page",
      entityId: String(page.id),
      action: "update",
      diffJson: dto,
      changedBy: userId,
    });
    return page;
  }

  async updateSeo(id: number, dto: UpdatePageDto, userId?: number) {
    const page = await this.prisma.page.update({
      where: { id },
      data: {
        seoTitle: dto.seoTitle,
        seoDescription: dto.seoDescription,
        ogImage: dto.ogImage,
      },
    });
    await this.audit.create({
      entityType: "Page",
      entityId: String(page.id),
      action: "update_seo",
      diffJson: dto,
      changedBy: userId,
    });
    return page;
  }

  async publish(id: number, userId?: number) {
    const page = await this.prisma.page.update({
      where: { id },
      data: { status: "PUBLISHED", publishedAt: new Date() },
    });
    await this.audit.create({
      entityType: "Page",
      entityId: String(page.id),
      action: "publish",
      changedBy: userId,
    });
    return page;
  }

  async unpublish(id: number, userId?: number) {
    const page = await this.prisma.page.update({
      where: { id },
      data: { status: "DRAFT" },
    });
    await this.audit.create({
      entityType: "Page",
      entityId: String(page.id),
      action: "unpublish",
      changedBy: userId,
    });
    return page;
  }

  async remove(id: number, userId?: number) {
    const page = await this.prisma.page.delete({ where: { id } });
    await this.audit.create({
      entityType: "Page",
      entityId: String(page.id),
      action: "delete",
      changedBy: userId,
    });
    return page;
  }
}
