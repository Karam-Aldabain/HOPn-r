import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { AuditService } from "../audit/audit.service";
import { CreateMediaDto } from "./dto/create-media.dto";
import { UpdateMediaDto } from "./dto/update-media.dto";

@Injectable()
export class MediaService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  findAll() {
    return this.prisma.mediaAsset.findMany({ orderBy: { createdAt: "desc" } });
  }

  findOne(id: number) {
    return this.prisma.mediaAsset.findUnique({ where: { id } });
  }

  async create(dto: CreateMediaDto, userId?: number) {
    const asset = await this.prisma.mediaAsset.create({ data: dto });
    await this.audit.create({
      entityType: "MediaAsset",
      entityId: String(asset.id),
      action: "create",
      diffJson: dto,
      changedBy: userId,
    });
    return asset;
  }

  async update(id: number, dto: UpdateMediaDto, userId?: number) {
    const asset = await this.prisma.mediaAsset.update({ where: { id }, data: dto });
    await this.audit.create({
      entityType: "MediaAsset",
      entityId: String(asset.id),
      action: "update",
      diffJson: dto,
      changedBy: userId,
    });
    return asset;
  }

  async remove(id: number, userId?: number) {
    const asset = await this.prisma.mediaAsset.delete({ where: { id } });
    await this.audit.create({
      entityType: "MediaAsset",
      entityId: String(asset.id),
      action: "delete",
      changedBy: userId,
    });
    return asset;
  }
}
