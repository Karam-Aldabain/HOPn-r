import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { AuditService } from "../audit/audit.service";
import { UserRole } from "@prisma/client";

@Injectable()
export class SettingsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  findAll() {
    return this.prisma.setting.findMany({ orderBy: { key: "asc" } });
  }

  findOne(key: string) {
    return this.prisma.setting.findUnique({ where: { key } });
  }

  async upsert(key: string, valueJson: any, userId?: number, role?: UserRole) {
    if (role === UserRole.TECHNICAL_ADMIN && key !== "integrations") {
      throw new ForbiddenException("Technical Admin can only update integrations settings.");
    }
    const setting = await this.prisma.setting.upsert({
      where: { key },
      update: { valueJson },
      create: { key, valueJson },
    });
    await this.audit.create({
      entityType: "Setting",
      entityId: setting.key,
      action: "upsert",
      diffJson: { key, valueJson },
      changedBy: userId,
    });
    return setting;
  }
}
