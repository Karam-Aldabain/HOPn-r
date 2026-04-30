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
exports.PublicService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let PublicService = class PublicService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    listPages() {
        return this.prisma.page.findMany({
            where: { status: "PUBLISHED" },
            include: { sections: { orderBy: { order: "asc" } } },
            orderBy: { title: "asc" },
        });
    }
    getPageBySlug(slug) {
        return this.prisma.page.findFirst({
            where: { slug, status: "PUBLISHED" },
            include: { sections: { orderBy: { order: "asc" } } },
        });
    }
    listSolutions(visible) {
        return this.prisma.solution.findMany({
            where: typeof visible === "boolean" ? { visible } : undefined,
            orderBy: { order: "asc" },
        });
    }
    listProjects(params) {
        const where = {};
        if (typeof params.published === "boolean")
            where.published = params.published;
        if (typeof params.featured === "boolean")
            where.featured = params.featured;
        if (params.industry)
            where.industry = params.industry;
        if (params.tech)
            where.techTags = { has: params.tech };
        return this.prisma.project.findMany({
            where,
            orderBy: { order: "asc" },
        });
    }
    listPartners(visible) {
        return this.prisma.partner.findMany({
            where: typeof visible === "boolean" ? { visible } : undefined,
            orderBy: { order: "asc" },
        });
    }
    listTeam(visible) {
        return this.prisma.teamMember.findMany({
            where: typeof visible === "boolean" ? { visible } : undefined,
            orderBy: { order: "asc" },
        });
    }
    listNav() {
        return this.prisma.navItem.findMany({
            where: { visible: true },
            orderBy: [{ location: "asc" }, { order: "asc" }],
        });
    }
    getPartnerSettings() {
        return this.prisma.partnerSettings.findFirst();
    }
    getSetting(key) {
        if (!key) {
            return this.prisma.setting.findMany({ orderBy: { key: "asc" } });
        }
        return this.prisma.setting.findUnique({ where: { key } });
    }
};
exports.PublicService = PublicService;
exports.PublicService = PublicService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PublicService);
//# sourceMappingURL=public.service.js.map