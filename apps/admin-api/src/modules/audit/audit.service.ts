import { Injectable } from "@nestjs/common";
import type { Prisma } from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaService) {}

  list(skip = 0, take = 50) {
    return this.prisma.auditLog.findMany({
      orderBy: { timestamp: "desc" },
      skip,
      take,
    });
  }

  create(entry: {
    entityType: string;
    entityId: string;
    action: string;
    diffJson?: unknown;
    changedBy?: number;
  }) {
    const data: Prisma.AuditLogUncheckedCreateInput = {
      entityType: entry.entityType,
      entityId: entry.entityId,
      action: entry.action,
      diffJson: entry.diffJson as Prisma.InputJsonValue | undefined,
      changedBy: entry.changedBy ?? null,
    };
    return this.prisma.auditLog.create({ data });
  }
}
