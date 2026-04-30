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
exports.PagesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const client_1 = require("@prisma/client");
const audit_service_1 = require("../audit/audit.service");
let PagesService = class PagesService {
    prisma;
    audit;
    constructor(prisma, audit) {
        this.prisma = prisma;
        this.audit = audit;
    }
    findAll() {
        return this.prisma.page.findMany({ include: { sections: true } });
    }
    findOne(id) {
        return this.prisma.page.findUnique({ where: { id }, include: { sections: true } });
    }
    async create(dto, userId, role) {
        const data = { ...dto };
        if (role === client_1.UserRole.EDITOR) {
            data.status = "DRAFT";
            data.publishedAt = null;
        }
        const page = await this.prisma.page.create({ data });
        await this.audit.create({
            entityType: "Page",
            entityId: String(page.id),
            action: "create",
            diffJson: dto,
            changedBy: userId,
        });
        return page;
    }
    async update(id, dto, userId, role) {
        const data = { ...dto };
        if (role === client_1.UserRole.EDITOR) {
            data.status = "DRAFT";
            data.publishedAt = null;
        }
        const page = await this.prisma.page.update({ where: { id }, data });
        await this.audit.create({
            entityType: "Page",
            entityId: String(page.id),
            action: "update",
            diffJson: dto,
            changedBy: userId,
        });
        return page;
    }
    async updateSeo(id, dto, userId) {
        const page = await this.prisma.page.update({
            where: { id },
            data: {
                seoTitle: dto.seoTitle,
                seoDescription: dto.seoDescription,
                ogImage: dto.ogImage,
            },
        });
        await this.audit.create({
            entityType: "Page",
            entityId: String(page.id),
            action: "update_seo",
            diffJson: dto,
            changedBy: userId,
        });
        return page;
    }
    async publish(id, userId) {
        const page = await this.prisma.page.update({
            where: { id },
            data: { status: "PUBLISHED", publishedAt: new Date() },
        });
        await this.audit.create({
            entityType: "Page",
            entityId: String(page.id),
            action: "publish",
            changedBy: userId,
        });
        return page;
    }
    async unpublish(id, userId) {
        const page = await this.prisma.page.update({
            where: { id },
            data: { status: "DRAFT" },
        });
        await this.audit.create({
            entityType: "Page",
            entityId: String(page.id),
            action: "unpublish",
            changedBy: userId,
        });
        return page;
    }
    async remove(id, userId) {
        const page = await this.prisma.page.delete({ where: { id } });
        await this.audit.create({
            entityType: "Page",
            entityId: String(page.id),
            action: "delete",
            changedBy: userId,
        });
        return page;
    }
};
exports.PagesService = PagesService;
exports.PagesService = PagesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        audit_service_1.AuditService])
], PagesService);
//# sourceMappingURL=pages.service.js.map