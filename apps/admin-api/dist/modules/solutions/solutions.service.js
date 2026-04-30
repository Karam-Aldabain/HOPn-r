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
exports.SolutionsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const audit_service_1 = require("../audit/audit.service");
const client_1 = require("@prisma/client");
let SolutionsService = class SolutionsService {
    prisma;
    audit;
    constructor(prisma, audit) {
        this.prisma = prisma;
        this.audit = audit;
    }
    findAll() {
        return this.prisma.solution.findMany({ orderBy: { order: "asc" } });
    }
    findOne(id) {
        return this.prisma.solution.findUnique({ where: { id } });
    }
    async create(dto, userId, role) {
        const data = { ...dto };
        if (role === client_1.UserRole.EDITOR) {
            data.visible = false;
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
    async update(id, dto, userId, role) {
        const data = { ...dto };
        if (role === client_1.UserRole.EDITOR) {
            data.visible = false;
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
    async remove(id, userId) {
        const solution = await this.prisma.solution.delete({ where: { id } });
        await this.audit.create({
            entityType: "Solution",
            entityId: String(solution.id),
            action: "delete",
            changedBy: userId,
        });
        return solution;
    }
    async reorder(ids, userId) {
        await this.prisma.$transaction(ids.map((id, index) => this.prisma.solution.update({ where: { id }, data: { order: index } })));
        await this.audit.create({
            entityType: "Solution",
            entityId: "bulk",
            action: "reorder",
            diffJson: { ids },
            changedBy: userId,
        });
        return { ok: true };
    }
};
exports.SolutionsService = SolutionsService;
exports.SolutionsService = SolutionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        audit_service_1.AuditService])
], SolutionsService);
//# sourceMappingURL=solutions.service.js.map