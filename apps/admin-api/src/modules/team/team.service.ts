import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { AuditService } from "../audit/audit.service";
import { CreateTeamMemberDto } from "./dto/create-team-member.dto";
import { UpdateTeamMemberDto } from "./dto/update-team-member.dto";
import { UserRole } from "@prisma/client";

@Injectable()
export class TeamService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  findAll() {
    return this.prisma.teamMember.findMany({ orderBy: { order: "asc" } });
  }

  findOne(id: number) {
    return this.prisma.teamMember.findUnique({ where: { id } });
  }

  async create(dto: CreateTeamMemberDto, userId?: number, role?: UserRole) {
    const data = { ...dto };
    if (role === UserRole.EDITOR) {
      (data as any).visible = false;
    }
    const member = await this.prisma.teamMember.create({ data });
    await this.audit.create({
      entityType: "TeamMember",
      entityId: String(member.id),
      action: "create",
      diffJson: dto,
      changedBy: userId,
    });
    return member;
  }

  async update(id: number, dto: UpdateTeamMemberDto, userId?: number, role?: UserRole) {
    const data = { ...dto };
    if (role === UserRole.EDITOR) {
      (data as any).visible = false;
    }
    const member = await this.prisma.teamMember.update({ where: { id }, data });
    await this.audit.create({
      entityType: "TeamMember",
      entityId: String(member.id),
      action: "update",
      diffJson: dto,
      changedBy: userId,
    });
    return member;
  }

  async remove(id: number, userId?: number) {
    const member = await this.prisma.teamMember.delete({ where: { id } });
    await this.audit.create({
      entityType: "TeamMember",
      entityId: String(member.id),
      action: "delete",
      changedBy: userId,
    });
    return member;
  }

  async reorder(ids: number[], userId?: number) {
    await this.prisma.$transaction(
      ids.map((id, index) =>
        this.prisma.teamMember.update({ where: { id }, data: { order: index } }),
      ),
    );
    await this.audit.create({
      entityType: "TeamMember",
      entityId: "bulk",
      action: "reorder",
      diffJson: { ids },
      changedBy: userId,
    });
    return { ok: true };
  }
}
