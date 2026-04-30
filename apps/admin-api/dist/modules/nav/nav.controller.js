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
exports.NavController = void 0;
const common_1 = require("@nestjs/common");
const nav_service_1 = require("./nav.service");
const create_nav_item_dto_1 = require("./dto/create-nav-item.dto");
const update_nav_item_dto_1 = require("./dto/update-nav-item.dto");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const user_decorator_1 = require("../../common/decorators/user.decorator");
const reorder_dto_1 = require("../../common/dto/reorder.dto");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const client_1 = require("@prisma/client");
const update_navigation_dto_1 = require("./dto/update-navigation.dto");
let NavController = class NavController {
    navService;
    constructor(navService) {
        this.navService = navService;
    }
    findAll() {
        return this.navService.findAll();
    }
    findOne(id) {
        return this.navService.findOne(id);
    }
    create(dto, user) {
        return this.navService.create(dto, user?.id);
    }
    update(id, dto, user) {
        return this.navService.update(id, dto, user?.id);
    }
    remove(id, user) {
        return this.navService.remove(id, user?.id);
    }
    reorder(dto, user) {
        return this.navService.reorder(dto.ids, user?.id);
    }
    replaceHeader(dto, user) {
        return this.navService.replaceNavigation("HEADER", dto.items || [], user?.id);
    }
    replaceFooter(dto, user) {
        return this.navService.replaceNavigation("FOOTER", dto.items || [], user?.id);
    }
};
exports.NavController = NavController;
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.CONTENT_MANAGER),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], NavController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(":id"),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.CONTENT_MANAGER),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], NavController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.CONTENT_MANAGER),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_nav_item_dto_1.CreateNavItemDto, Object]),
    __metadata("design:returntype", void 0)
], NavController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(":id"),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.CONTENT_MANAGER),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_nav_item_dto_1.UpdateNavItemDto, Object]),
    __metadata("design:returntype", void 0)
], NavController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(":id"),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.CONTENT_MANAGER),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __param(1, (0, user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], NavController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)("reorder"),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.CONTENT_MANAGER),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [reorder_dto_1.ReorderDto, Object]),
    __metadata("design:returntype", void 0)
], NavController.prototype, "reorder", null);
__decorate([
    (0, common_1.Put)("header"),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.CONTENT_MANAGER),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_navigation_dto_1.UpdateNavigationDto, Object]),
    __metadata("design:returntype", void 0)
], NavController.prototype, "replaceHeader", null);
__decorate([
    (0, common_1.Put)("footer"),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.CONTENT_MANAGER),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_navigation_dto_1.UpdateNavigationDto, Object]),
    __metadata("design:returntype", void 0)
], NavController.prototype, "replaceFooter", null);
exports.NavController = NavController = __decorate([
    (0, common_1.Controller)("admin/navigation"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [nav_service_1.NavService])
], NavController);
//# sourceMappingURL=nav.controller.js.map