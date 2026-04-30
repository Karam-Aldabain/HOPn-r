import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { AuditService } from "../audit/audit.service";
import { CreateSolutionDto } from "./dto/create-solution.dto";
import { UpdateSolutionDto } from "./dto/update-solution.dto";
import { UserRole } from "@prisma/client";

@Injectable()
export class SolutionsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  findAll() {
    return this.prisma.solution.findMany({ orderBy: { order: "asc" } });
  }

  findOne(id: number) {
    return this.prisma.solution.findUnique({ where: { id } });
  }

  async create(dto: CreateSolutionDto, userId?: number, role?: UserRole) {
    const data = { ...dto };
    if (role === UserRole.EDITOR) {
      (data as any).visible = false;
    }
    const solution = await this.prisma.solution.create({ data });
    await this.audit.create({
      entityType: "Solution",
      entityId: String(solution.id),
      action: "create",
      diffJson: dto,
      changedBy: userId,
    });
    return solution;
  }

  async update(id: number, dto: UpdateSolutionDto, userId?: number, role?: UserRole) {
    const data = { ...dto };
    if (role === UserRole.EDITOR) {
      (data as any).visible = false;
    }
    const solution = await this.prisma.solution.update({ where: { id }, data });
    await this.audit.create({
      entityType: "Solution",
      entityId: String(solution.id),
      action: "update",
      diffJson: dto,
      changedBy: userId,
    });
    return solution;
  }

  async remove(id: number, userId?: number) {
    const solution = await this.prisma.solution.delete({ where: { id } });
    await this.audit.create({
      entityType: "Solution",
      entityId: String(solution.id),
      action: "delete",
      changedBy: userId,
    });
    return solution;
  }

  async reorder(ids: number[], userId?: number) {
    await this.prisma.$transaction(
      ids.map((id, index) =>
        this.prisma.solution.update({ where: { id }, data: { order: index } }),
      ),
    );
    await this.audit.create({
      entityType: "Solution",
      entityId: "bulk",
      action: "reorder",
      diffJson: { ids },
      changedBy: userId,
    });
    return { ok: true };
  }
}
