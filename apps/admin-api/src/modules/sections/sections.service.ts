import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { AuditService } from "../audit/audit.service";
import { CreateSectionDto } from "./dto/create-section.dto";
import { UpdateSectionDto } from "./dto/update-section.dto";

@Injectable()
export class SectionsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  listByPage(pageId: number) {
    return this.prisma.section.findMany({
      where: { pageId },
      orderBy: { order: "asc" },
    });
  }

  findOne(id: number) {
    return this.prisma.section.findUnique({ where: { id } });
  }

  async create(dto: CreateSectionDto, userId?: number) {
    if (dto.pageId == null) {
      throw new Error("pageId is required");
    }
    const { pageId, ...rest } = dto;
    const section = await this.prisma.section.create({
      data: {
        pageId,
        ...rest,
      },
    });
    await this.audit.create({
      entityType: "Section",
      entityId: String(section.id),
      action: "create",
      diffJson: dto,
      changedBy: userId,
    });
    return section;
  }

  async update(id: number, dto: UpdateSectionDto, userId?: number) {
    const { pageId, ...rest } = dto;
    const section = await this.prisma.section.update({ where: { id }, data: rest });
    await this.audit.create({
      entityType: "Section",
      entityId: String(section.id),
      action: "update",
      diffJson: dto,
      changedBy: userId,
    });
    return section;
  }

  async remove(id: number, userId?: number) {
    const section = await this.prisma.section.delete({ where: { id } });
    await this.audit.create({
      entityType: "Section",
      entityId: String(section.id),
      action: "delete",
      changedBy: userId,
    });
    return section;
  }

  async reorder(pageId: number, sectionIds: number[], userId?: number) {
    await this.prisma.$transaction(
      sectionIds.map((id, index) =>
        this.prisma.section.update({
          where: { id },
          data: { order: index },
        }),
      ),
    );
    await this.audit.create({
      entityType: "Section",
      entityId: String(pageId),
      action: "reorder",
      diffJson: { sectionIds },
      changedBy: userId,
    });
    return { ok: true };
  }
}
