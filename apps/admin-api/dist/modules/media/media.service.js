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
exports.MediaService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const audit_service_1 = require("../audit/audit.service");
let MediaService = class MediaService {
    prisma;
    audit;
    constructor(prisma, audit) {
        this.prisma = prisma;
        this.audit = audit;
    }
    findAll() {
        return this.prisma.mediaAsset.findMany({ orderBy: { createdAt: "desc" } });
    }
    findOne(id) {
        return this.prisma.mediaAsset.findUnique({ where: { id } });
    }
    async create(dto, userId) {
        const asset = await this.prisma.mediaAsset.create({ data: dto });
        await this.audit.create({
            entityType: "MediaAsset",
            entityId: String(asset.id),
            action: "create",
            diffJson: dto,
            changedBy: userId,
        });
        return asset;
    }
    async update(id, dto, userId) {
        const asset = await this.prisma.mediaAsset.update({ where: { id }, data: dto });
        await this.audit.create({
            entityType: "MediaAsset",
            entityId: String(asset.id),
            action: "update",
            diffJson: dto,
            changedBy: userId,
        });
        return asset;
    }
    async remove(id, userId) {
        const asset = await this.prisma.mediaAsset.delete({ where: { id } });
        await this.audit.create({
            entityType: "MediaAsset",
            entityId: String(asset.id),
            action: "delete",
            changedBy: userId,
        });
        return asset;
    }
};
exports.MediaService = MediaService;
exports.MediaService = MediaService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        audit_service_1.AuditService])
], MediaService);
//# sourceMappingURL=media.service.js.map