import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { AuditService } from "../audit/audit.service";
import { CreateNavItemDto } from "./dto/create-nav-item.dto";
import { UpdateNavItemDto } from "./dto/update-nav-item.dto";

@Injectable()
export class NavService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  findAll() {
    return this.prisma.navItem.findMany({
      orderBy: [{ location: "asc" }, { order: "asc" }],
    });
  }

  findOne(id: number) {
    return this.prisma.navItem.findUnique({ where: { id } });
  }

  async create(dto: CreateNavItemDto, userId?: number) {
    const item = await this.prisma.navItem.create({ data: dto });
    await this.audit.create({
      entityType: "NavItem",
      entityId: String(item.id),
      action: "create",
      diffJson: dto,
      changedBy: userId,
    });
    return item;
  }

  async update(id: number, dto: UpdateNavItemDto, userId?: number) {
    const item = await this.prisma.navItem.update({ where: { id }, data: dto });
    await this.audit.create({
      entityType: "NavItem",
      entityId: String(item.id),
      action: "update",
      diffJson: dto,
      changedBy: userId,
    });
    return item;
  }

  async remove(id: number, userId?: number) {
    const item = await this.prisma.navItem.delete({ where: { id } });
    await this.audit.create({
      entityType: "NavItem",
      entityId: String(item.id),
      action: "delete",
      changedBy: userId,
    });
    return item;
  }

  async reorder(ids: number[], userId?: number) {
    await this.prisma.$transaction(
      ids.map((id, index) =>
        this.prisma.navItem.update({ where: { id }, data: { order: index } }),
      ),
    );
    await this.audit.create({
      entityType: "NavItem",
      entityId: "bulk",
      action: "reorder",
      diffJson: { ids },
      changedBy: userId,
    });
    return { ok: true };
  }

  async replaceNavigation(
    location: "HEADER" | "FOOTER",
    items: Array<{
      label: string;
      url: string;
      order?: number;
      visible?: boolean;
      isCta?: boolean;
      external?: boolean;
    }>,
    userId?: number,
  ) {
    await this.prisma.$transaction([
      this.prisma.navItem.deleteMany({ where: { location } }),
      this.prisma.navItem.createMany({
        data: items.map((item, index) => ({
          label: item.label,
          url: item.url,
          order: item.order ?? index,
          visible: item.visible ?? true,
          isCta: item.isCta ?? false,
          external: item.external ?? false,
          location,
        })),
      }),
    ]);
    await this.audit.create({
      entityType: "NavItem",
      entityId: `bulk:${location.toLowerCase()}`,
      action: "replace",
      diffJson: { location, items },
      changedBy: userId,
    });
    return this.findAll();
  }
}
