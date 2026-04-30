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
exports.SectionsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const audit_service_1 = require("../audit/audit.service");
let SectionsService = class SectionsService {
    prisma;
    audit;
    constructor(prisma, audit) {
        this.prisma = prisma;
        this.audit = audit;
    }
    listByPage(pageId) {
        return this.prisma.section.findMany({
            where: { pageId },
            orderBy: { order: "asc" },
        });
    }
    findOne(id) {
        return this.prisma.section.findUnique({ where: { id } });
    }
    async create(dto, userId) {
        if (dto.pageId == null) {
            throw new Error("pageId is required");
        }
        const { pageId, ...rest } = dto;
        const section = await this.prisma.section.create({
            data: {
                pageId,
                ...rest,
            },
        });
        await this.audit.create({
            entityType: "Section",
            entityId: String(section.id),
            action: "create",
            diffJson: dto,
            changedBy: userId,
        });
        return section;
    }
    async update(id, dto, userId) {
        const { pageId, ...rest } = dto;
        const section = await this.prisma.section.update({ where: { id }, data: rest });
        await this.audit.create({
            entityType: "Section",
            entityId: String(section.id),
            action: "update",
            diffJson: dto,
            changedBy: userId,
        });
        return section;
    }
    async remove(id, userId) {
        const section = await this.prisma.section.delete({ where: { id } });
        await this.audit.create({
            entityType: "Section",
            entityId: String(section.id),
            action: "delete",
            changedBy: userId,
        });
        return section;
    }
    async reorder(pageId, sectionIds, userId) {
        await this.prisma.$transaction(sectionIds.map((id, index) => this.prisma.section.update({
            where: { id },
            data: { order: index },
        })));
        await this.audit.create({
            entityType: "Section",
            entityId: String(pageId),
            action: "reorder",
            diffJson: { sectionIds },
            changedBy: userId,
        });
        return { ok: true };
    }
};
exports.SectionsService = SectionsService;
exports.SectionsService = SectionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        audit_service_1.AuditService])
], SectionsService);
//# sourceMappingURL=sections.service.js.map