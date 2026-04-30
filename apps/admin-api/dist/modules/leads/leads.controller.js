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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeadsController = void 0;
const common_1 = require("@nestjs/common");
const throttler_1 = require("@nestjs/throttler");
const leads_service_1 = require("./leads.service");
const create_lead_dto_1 = require("./dto/create-lead.dto");
const update_lead_status_dto_1 = require("./dto/update-lead-status.dto");
const create_lead_note_dto_1 = require("./dto/create-lead-note.dto");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const user_decorator_1 = require("../../common/decorators/user.decorator");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const client_1 = require("@prisma/client");
let LeadsController = class LeadsController {
    leadsService;
    constructor(leadsService) {
        this.leadsService = leadsService;
    }
    create(dto) {
        return this.leadsService.create(dto);
    }
    findAll(status, topic, from, to) {
        return this.leadsService.findAll({ status, topic, from, to });
    }
    async exportCsv(res, status, topic, from, to) {
        const leads = await this.leadsService.findAll({ status, topic, from, to });
        const headers = [
            "id",
            "name",
            "email",
            "company",
            "topic",
            "message",
            "consent",
            "status",
            "notes",
            "createdAt",
        ];
        const lines = [
            headers.join(","),
            ...leads.map((l) => headers
                .map((h) => {
                let value = l[h];
                if (h === "notes" && Array.isArray(l.notes)) {
                    value = l.notes.map((n) => n.body).join(" | ");
                }
                const safe = String(value ?? "").replace(/"/g, '""');
                return `"${safe}"`;
            })
                .join(",")),
        ];
        res.setHeader("Content-Type", "text/csv");
        res.setHeader("Content-Disposition", "attachment; filename=leads.csv");
        res.send(lines.join("\n"));
    }
    findOne(id) {
        return this.leadsService.findOne(id);
    }
    updateStatus(id, dto, user) {
        return this.leadsService.updateStatus(id, dto.status, user?.id);
    }
    addNote(id, dto, user) {
        return this.leadsService.addNote(id, dto.body, user?.id);
    }
    remove(id, user) {
        return this.leadsService.remove(id, user?.id);
    }
};
exports.LeadsController = LeadsController;
__decorate([
    (0, common_1.Post)("leads"),
    (0, throttler_1.Throttle)({ default: { limit: 10, ttl: 60 } }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_lead_dto_1.CreateLeadDto]),
    __metadata("design:returntype", void 0)
], LeadsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)("admin/leads"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.MARKETING_CRM_MANAGER, client_1.UserRole.CONTENT_MANAGER),
    __param(0, (0, common_1.Query)("status")),
    __param(1, (0, common_1.Query)("topic")),
    __param(2, (0, common_1.Query)("from")),
    __param(3, (0, common_1.Query)("to")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", void 0)
], LeadsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)("admin/leads/export.csv"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.MARKETING_CRM_MANAGER),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)("status")),
    __param(2, (0, common_1.Query)("topic")),
    __param(3, (0, common_1.Query)("from")),
    __param(4, (0, common_1.Query)("to")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String, String]),
    __metadata("design:returntype", Promise)
], LeadsController.prototype, "exportCsv", null);
__decorate([
    (0, common_1.Get)("admin/leads/:id"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.MARKETING_CRM_MANAGER, client_1.UserRole.CONTENT_MANAGER),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], LeadsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)("admin/leads/:id/status"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.MARKETING_CRM_MANAGER),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_lead_status_dto_1.UpdateLeadStatusDto, Object]),
    __metadata("design:returntype", void 0)
], LeadsController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Post)("admin/leads/:id/notes"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.MARKETING_CRM_MANAGER),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, create_lead_note_dto_1.CreateLeadNoteDto, Object]),
    __metadata("design:returntype", void 0)
], LeadsController.prototype, "addNote", null);
__decorate([
    (0, common_1.Delete)("admin/leads/:id"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __param(1, (0, user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], LeadsController.prototype, "remove", null);
exports.LeadsController = LeadsController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [leads_service_1.LeadsService])
], LeadsController);
//# sourceMappingURL=leads.controller.js.map