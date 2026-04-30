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
exports.SectionsController = void 0;
const common_1 = require("@nestjs/common");
const sections_service_1 = require("./sections.service");
const create_section_dto_1 = require("./dto/create-section.dto");
const update_section_dto_1 = require("./dto/update-section.dto");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const user_decorator_1 = require("../../common/decorators/user.decorator");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const client_1 = require("@prisma/client");
let SectionsController = class SectionsController {
    sectionsService;
    constructor(sectionsService) {
        this.sectionsService = sectionsService;
    }
    list(pageId) {
        return this.sectionsService.listByPage(pageId);
    }
    findOne(id) {
        return this.sectionsService.findOne(id);
    }
    create(pageId, dto, user) {
        return this.sectionsService.create({ ...dto, pageId }, user?.id);
    }
    update(id, dto, user) {
        return this.sectionsService.update(id, dto, user?.id);
    }
    remove(id, user) {
        return this.sectionsService.remove(id, user?.id);
    }
};
exports.SectionsController = SectionsController;
__decorate([
    (0, common_1.Get)("pages/:pageId/sections"),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.CONTENT_MANAGER, client_1.UserRole.EDITOR),
    __param(0, (0, common_1.Param)("pageId", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], SectionsController.prototype, "list", null);
__decorate([
    (0, common_1.Get)("sections/:id"),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.CONTENT_MANAGER, client_1.UserRole.EDITOR),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], SectionsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)("pages/:pageId/sections"),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.CONTENT_MANAGER, client_1.UserRole.EDITOR),
    __param(0, (0, common_1.Param)("pageId", common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, create_section_dto_1.CreateSectionDto, Object]),
    __metadata("design:returntype", void 0)
], SectionsController.prototype, "create", null);
__decorate([
    (0, common_1.Put)("sections/:id"),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.CONTENT_MANAGER, client_1.UserRole.EDITOR),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_section_dto_1.UpdateSectionDto, Object]),
    __metadata("design:returntype", void 0)
], SectionsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)("sections/:id"),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.CONTENT_MANAGER),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __param(1, (0, user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], SectionsController.prototype, "remove", null);
exports.SectionsController = SectionsController = __decorate([
    (0, common_1.Controller)("admin"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [sections_service_1.SectionsService])
], SectionsController);
//# sourceMappingURL=sections.controller.js.map