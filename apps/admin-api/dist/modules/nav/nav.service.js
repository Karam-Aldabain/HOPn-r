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
exports.NavService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const audit_service_1 = require("../audit/audit.service");
let NavService = class NavService {
    prisma;
    audit;
    constructor(prisma, audit) {
        this.prisma = prisma;
        this.audit = audit;
    }
    findAll() {
        return this.prisma.navItem.findMany({
            orderBy: [{ location: "asc" }, { order: "asc" }],
        });
    }
    findOne(id) {
        return this.prisma.navItem.findUnique({ where: { id } });
    }
    async create(dto, userId) {
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
    async update(id, dto, userId) {
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
    async remove(id, userId) {
        const item = await this.prisma.navItem.delete({ where: { id } });
        await this.audit.create({
            entityType: "NavItem",
            entityId: String(item.id),
            action: "delete",
            changedBy: userId,
        });
        return item;
    }
    async reorder(ids, userId) {
        await this.prisma.$transaction(ids.map((id, index) => this.prisma.navItem.update({ where: { id }, data: { order: index } })));
        await this.audit.create({
            entityType: "NavItem",
            entityId: "bulk",
            action: "reorder",
            diffJson: { ids },
            changedBy: userId,
        });
        return { ok: true };
    }
    async replaceNavigation(location, items, userId) {
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
};
exports.NavService = NavService;
exports.NavService = NavService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        audit_service_1.AuditService])
], NavService);
//# sourceMappingURL=nav.service.js.map