"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const audit_service_1 = require("../audit/audit.service");
const client_1 = require("@prisma/client");
let ProjectsService = class ProjectsService {
    prisma;
    audit;
    constructor(prisma, audit) {
        this.prisma = prisma;
        this.audit = audit;
    }
    findAll() {
        return this.prisma.project.findMany({ orderBy: { order: "asc" } });
    }
    findOne(id) {
        return this.prisma.project.findUnique({ where: { id } });
    }
    async create(dto, userId, role) {
        const data = { ...dto };
        if (role === client_1.UserRole.EDITOR) {
            data.published = false;
            data.featured = false;
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
    async update(id, dto, userId, role) {
        const data = { ...dto };
        if (role === client_1.UserRole.EDITOR) {
            data.published = false;
            data.featured = false;
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
    async remove(id, userId) {
        const project = await this.prisma.project.delete({ where: { id } });
        await this.audit.create({
            entityType: "Project",
            entityId: String(project.id),
            action: "delete",
            changedBy: userId,
        });
        return project;
    }
    async reorder(ids, userId) {
        await this.prisma.$transaction(ids.map((id, index) => this.prisma.project.update({ where: { id }, data: { order: index } })));
        await this.audit.create({
            entityType: "Project",
            entityId: "bulk",
            action: "reorder",
            diffJson: { ids },
            changedBy: userId,
        });
        return { ok: true };
    }
};
exports.ProjectsService = ProjectsService;
exports.ProjectsService = ProjectsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        audit_service_1.AuditService])
], ProjectsService);
//# sourceMappingURL=projects.service.js.map