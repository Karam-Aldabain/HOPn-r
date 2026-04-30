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
exports.SettingsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const audit_service_1 = require("../audit/audit.service");
const client_1 = require("@prisma/client");
let SettingsService = class SettingsService {
    prisma;
    audit;
    constructor(prisma, audit) {
        this.prisma = prisma;
        this.audit = audit;
    }
    findAll() {
        return this.prisma.setting.findMany({ orderBy: { key: "asc" } });
    }
    findOne(key) {
        return this.prisma.setting.findUnique({ where: { key } });
    }
    async upsert(key, valueJson, userId, role) {
        if (role === client_1.UserRole.TECHNICAL_ADMIN && key !== "integrations") {
            throw new common_1.ForbiddenException("Technical Admin can only update integrations settings.");
        }
        const setting = await this.prisma.setting.upsert({
            where: { key },
            update: { valueJson },
            create: { key, valueJson },
        });
        await this.audit.create({
            entityType: "Setting",
            entityId: setting.key,
            action: "upsert",
            diffJson: { key, valueJson },
            changedBy: userId,
        });
        return setting;
    }
};
exports.SettingsService = SettingsService;
exports.SettingsService = SettingsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        audit_service_1.AuditService])
], SettingsService);
//# sourceMappingURL=settings.service.js.map