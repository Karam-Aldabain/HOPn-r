"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("../../prisma/prisma.service");
const audit_service_1 = require("../audit/audit.service");
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcryptjs"));
let UsersService = class UsersService {
    prisma;
    config;
    audit;
    constructor(prisma, config, audit) {
        this.prisma = prisma;
        this.config = config;
        this.audit = audit;
    }
    async onModuleInit() {
        const email = this.config.get("ADMIN_SEED_EMAIL");
        const password = this.config.get("ADMIN_SEED_PASSWORD");
        if (!email || !password)
            return;
        const existing = await this.prisma.adminUser.findUnique({ where: { email } });
        if (existing)
            return;
        const passwordHash = await bcrypt.hash(password, 10);
        await this.prisma.adminUser.create({
            data: {
                name: "HOPn Admin",
                email,
                role: client_1.UserRole.SUPER_ADMIN,
                passwordHash,
            },
        });
    }
    findAll() {
        return this.prisma.adminUser.findMany({ orderBy: { createdAt: "desc" } });
    }
    findById(id) {
        return this.prisma.adminUser.findUnique({ where: { id } });
    }
    findByEmail(email) {
        return this.prisma.adminUser.findUnique({ where: { email } });
    }
    async create(dto) {
        const passwordHash = await bcrypt.hash(dto.password, 10);
        const user = await this.prisma.adminUser.create({
            data: {
                name: dto.name,
                email: dto.email,
                role: dto.role ?? client_1.UserRole.CONTENT_MANAGER,
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
    async update(id, dto) {
        const data = {
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
    async setPassword(id, password) {
        const passwordHash = await bcrypt.hash(password, 10);
        return this.prisma.adminUser.update({
            where: { id },
            data: { passwordHash },
        });
    }
    async delete(id) {
        const user = await this.prisma.adminUser.delete({ where: { id } });
        await this.audit.create({
            entityType: "AdminUser",
            entityId: String(user.id),
            action: "delete",
        });
        return user;
    }
    touchLastLogin(id) {
        return this.prisma.adminUser.update({
            where: { id },
            data: { lastLogin: new Date() },
        });
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_1.ConfigService,
        audit_service_1.AuditService])
], UsersService);
//# sourceMappingURL=users.service.js.map