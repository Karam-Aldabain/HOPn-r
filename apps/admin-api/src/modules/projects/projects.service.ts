import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { AuditService } from "../audit/audit.service";
import { CreateProjectDto } from "./dto/create-project.dto";
import { UpdateProjectDto } from "./dto/update-project.dto";
import { UserRole } from "@prisma/client";

@Injectable()
export class ProjectsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  findAll() {
    return this.prisma.project.findMany({ orderBy: { order: "asc" } });
  }

  findOne(id: number) {
    return this.prisma.project.findUnique({ where: { id } });
  }

  async create(dto: CreateProjectDto, userId?: number, role?: UserRole) {
    const data = { ...dto };
    if (role === UserRole.EDITOR) {
      (data as any).published = false;
      (data as any).featured = false;
    }
    const project = await this.prisma.project.create({ data });
    await this.audit.create({
      entityType: "Project",
      entityId: String(project.id),
      action: "create",
      diffJson: dto,
      changedBy: userId,
    });
    return project;
  }

  async update(id: number, dto: UpdateProjectDto, userId?: number, role?: UserRole) {
    const data = { ...dto };
    if (role === UserRole.EDITOR) {
      (data as any).published = false;
      (data as any).featured = false;
    }
    const project = await this.prisma.project.update({ where: { id }, data });
    await this.audit.create({
      entityType: "Project",
      entityId: String(project.id),
      action: "update",
      diffJson: dto,
      changedBy: userId,
    });
    return project;
  }

  async remove(id: number, userId?: number) {
    const project = await this.prisma.project.delete({ where: { id } });
    await this.audit.create({
      entityType: "Project",
      entityId: String(project.id),
      action: "delete",
      changedBy: userId,
    });
    return project;
  }

  async reorder(ids: number[], userId?: number) {
    await this.prisma.$transaction(
      ids.map((id, index) =>
        this.prisma.project.update({ where: { id }, data: { order: index } }),
      ),
    );
    await this.audit.create({
      entityType: "Project",
      entityId: "bulk",
      action: "reorder",
      diffJson: { ids },
      changedBy: userId,
    });
    return { ok: true };
  }
}
