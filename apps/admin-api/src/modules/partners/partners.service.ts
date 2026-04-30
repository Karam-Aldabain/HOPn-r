import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { AuditService } from "../audit/audit.service";
import { CreatePartnerDto } from "./dto/create-partner.dto";
import { UpdatePartnerDto } from "./dto/update-partner.dto";
import { UserRole } from "@prisma/client";
import { UpdatePartnerSettingsDto } from "./dto/update-partner-settings.dto";

@Injectable()
export class PartnersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  findAll() {
    return this.prisma.partner.findMany({ orderBy: { order: "asc" } });
  }

  findOne(id: number) {
    return this.prisma.partner.findUnique({ where: { id } });
  }

  async create(dto: CreatePartnerDto, userId?: number, role?: UserRole) {
    const data = { ...dto };
    if (role === UserRole.EDITOR) {
      (data as any).visible = false;
    }
    const partner = await this.prisma.partner.create({ data });
    await this.audit.create({
      entityType: "Partner",
      entityId: String(partner.id),
      action: "create",
      diffJson: dto,
      changedBy: userId,
    });
    return partner;
  }

  async update(id: number, dto: UpdatePartnerDto, userId?: number, role?: UserRole) {
    const data = { ...dto };
    if (role === UserRole.EDITOR) {
      (data as any).visible = false;
    }
    const partner = await this.prisma.partner.update({ where: { id }, data });
    await this.audit.create({
      entityType: "Partner",
      entityId: String(partner.id),
      action: "update",
      diffJson: dto,
      changedBy: userId,
    });
    return partner;
  }

  async remove(id: number, userId?: number) {
    const partner = await this.prisma.partner.delete({ where: { id } });
    await this.audit.create({
      entityType: "Partner",
      entityId: String(partner.id),
      action: "delete",
      changedBy: userId,
    });
    return partner;
  }

  async reorder(ids: number[], userId?: number) {
    await this.prisma.$transaction(
      ids.map((id, index) =>
        this.prisma.partner.update({ where: { id }, data: { order: index } }),
      ),
    );
    await this.audit.create({
      entityType: "Partner",
      entityId: "bulk",
      action: "reorder",
      diffJson: { ids },
      changedBy: userId,
    });
    return { ok: true };
  }

  getSettings() {
    return this.prisma.partnerSettings.findFirst();
  }

  async updateSettings(dto: UpdatePartnerSettingsDto, userId?: number) {
    const settings = await this.prisma.partnerSettings.upsert({
      where: { id: 1 },
      update: {
        displayMode: dto.displayMode ?? undefined,
        carouselSpeed: dto.carouselSpeed ?? undefined,
      },
      create: {
        displayMode: dto.displayMode ?? "carousel",
        carouselSpeed: dto.carouselSpeed ?? 30,
      },
    });
    await this.audit.create({
      entityType: "PartnerSettings",
      entityId: String(settings.id),
      action: "update",
      diffJson: dto,
      changedBy: userId,
    });
    return settings;
  }
}
