import { Injectable, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "../../prisma/prisma.service";
import { AuditService } from "../audit/audit.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UserRole } from "@prisma/client";
import * as bcrypt from "bcryptjs";

@Injectable()
export class UsersService implements OnModuleInit {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
    private readonly audit: AuditService,
  ) {}

  async onModuleInit() {
    const email = this.config.get<string>("ADMIN_SEED_EMAIL");
    const password = this.config.get<string>("ADMIN_SEED_PASSWORD");
    if (!email || !password) return;
    const existing = await this.prisma.adminUser.findUnique({ where: { email } });
    if (existing) return;
    const passwordHash = await bcrypt.hash(password, 10);
    await this.prisma.adminUser.create({
      data: {
        name: "HOPn Admin",
        email,
        role: UserRole.SUPER_ADMIN,
        passwordHash,
      },
    });
  }

  findAll() {
    return this.prisma.adminUser.findMany({ orderBy: { createdAt: "desc" } });
  }

  findById(id: number) {
    return this.prisma.adminUser.findUnique({ where: { id } });
  }

  findByEmail(email: string) {
    return this.prisma.adminUser.findUnique({ where: { email } });
  }

  async create(dto: CreateUserDto) {
    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.adminUser.create({
      data: {
        name: dto.name,
        email: dto.email,
        role: dto.role ?? UserRole.CONTENT_MANAGER,
        passwordHash,
      },
    });
    await this.audit.create({
      entityType: "AdminUser",
      entityId: String(user.id),
      action: "create",
      diffJson: { name: dto.name, email: dto.email, role: dto.role },
    });
    return user;
  }

  async update(id: number, dto: UpdateUserDto) {
    const data: Record<string, unknown> = {
      name: dto.name,
      email: dto.email,
      role: dto.role,
      status: dto.status,
    };
    if (dto.password) {
      data.passwordHash = await bcrypt.hash(dto.password, 10);
    }
    const user = await this.prisma.adminUser.update({ where: { id }, data });
    await this.audit.create({
      entityType: "AdminUser",
      entityId: String(user.id),
      action: "update",
      diffJson: dto,
    });
    return user;
  }

  async setPassword(id: number, password: string) {
    const passwordHash = await bcrypt.hash(password, 10);
    return this.prisma.adminUser.update({
      where: { id },
      data: { passwordHash },
    });
  }

  async delete(id: number) {
    const user = await this.prisma.adminUser.delete({ where: { id } });
    await this.audit.create({
      entityType: "AdminUser",
      entityId: String(user.id),
      action: "delete",
    });
    return user;
  }

  touchLastLogin(id: number) {
    return this.prisma.adminUser.update({
      where: { id },
      data: { lastLogin: new Date() },
    });
  }
}
