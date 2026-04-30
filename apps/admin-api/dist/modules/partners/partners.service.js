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
exports.PartnersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const audit_service_1 = require("../audit/audit.service");
const client_1 = require("@prisma/client");
let PartnersService = class PartnersService {
    prisma;
    audit;
    constructor(prisma, audit) {
        this.prisma = prisma;
        this.audit = audit;
    }
    findAll() {
        return this.prisma.partner.findMany({ orderBy: { order: "asc" } });
    }
    findOne(id) {
        return this.prisma.partner.findUnique({ where: { id } });
    }
    async create(dto, userId, role) {
        const data = { ...dto };
        if (role === client_1.UserRole.EDITOR) {
            data.visible = false;
        }
        const partner = await this.prisma.partner.create({ data });
        await this.audit.create({
            entityType: "Partner",
            entityId: String(partner.id),
            action: "create",
            diffJson: dto,
            changedBy: userId,
        });
        return partner;
    }
    async update(id, dto, userId, role) {
        const data = { ...dto };
        if (role === client_1.UserRole.EDITOR) {
            data.visible = false;
        }
        const partner = await this.prisma.partner.update({ where: { id }, data });
        await this.audit.create({
            entityType: "Partner",
            entityId: String(partner.id),
            action: "update",
            diffJson: dto,
            changedBy: userId,
        });
        return partner;
    }
    async remove(id, userId) {
        const partner = await this.prisma.partner.delete({ where: { id } });
        await this.audit.create({
            entityType: "Partner",
            entityId: String(partner.id),
            action: "delete",
            changedBy: userId,
        });
        return partner;
    }
    async reorder(ids, userId) {
        await this.prisma.$transaction(ids.map((id, index) => this.prisma.partner.update({ where: { id }, data: { order: index } })));
        await this.audit.create({
            entityType: "Partner",
            entityId: "bulk",
            action: "reorder",
            diffJson: { ids },
            changedBy: userId,
        });
        return { ok: true };
    }
    getSettings() {
        return this.prisma.partnerSettings.findFirst();
    }
    async updateSettings(dto, userId) {
        const settings = await this.prisma.partnerSettings.upsert({
            where: { id: 1 },
            update: {
                displayMode: dto.displayMode ?? undefined,
                carouselSpeed: dto.carouselSpeed ?? undefined,
            },
            create: {
                displayMode: dto.displayMode ?? "carousel",
                carouselSpeed: dto.carouselSpeed ?? 30,
            },
        });
        await this.audit.create({
            entityType: "PartnerSettings",
            entityId: String(settings.id),
            action: "update",
            diffJson: dto,
            changedBy: userId,
        });
        return settings;
    }
};
exports.PartnersService = PartnersService;
exports.PartnersService = PartnersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        audit_service_1.AuditService])
], PartnersService);
//# sourceMappingURL=partners.service.js.map