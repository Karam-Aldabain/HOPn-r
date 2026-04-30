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
exports.PagesController = void 0;
const common_1 = require("@nestjs/common");
const pages_service_1 = require("./pages.service");
const create_page_dto_1 = require("./dto/create-page.dto");
const update_page_dto_1 = require("./dto/update-page.dto");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const user_decorator_1 = require("../../common/decorators/user.decorator");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const client_1 = require("@prisma/client");
const sections_service_1 = require("../sections/sections.service");
let PagesController = class PagesController {
    pagesService;
    sectionsService;
    constructor(pagesService, sectionsService) {
        this.pagesService = pagesService;
        this.sectionsService = sectionsService;
    }
    findAll() {
        return this.pagesService.findAll();
    }
    findOne(id) {
        return this.pagesService.findOne(id);
    }
    create(dto, user) {
        return this.pagesService.create(dto, user?.id, user?.role);
    }
    update(id, dto, user) {
        return this.pagesService.update(id, dto, user?.id, user?.role);
    }
    updateSeo(id, dto, user) {
        return this.pagesService.updateSeo(id, dto, user?.id);
    }
    updateSectionsOrder(id, body, user) {
        return this.sectionsService.reorder(id, body.sectionIds || [], user?.id);
    }
    publish(id, user) {
        return this.pagesService.publish(id, user?.id);
    }
    unpublish(id, user) {
        return this.pagesService.unpublish(id, user?.id);
    }
    remove(id, user) {
        return this.pagesService.remove(id, user?.id);
    }
};
exports.PagesController = PagesController;
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.CONTENT_MANAGER, client_1.UserRole.EDITOR),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PagesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(":id"),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.CONTENT_MANAGER, client_1.UserRole.EDITOR),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], PagesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.CONTENT_MANAGER, client_1.UserRole.EDITOR),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_page_dto_1.CreatePageDto, Object]),
    __metadata("design:returntype", void 0)
], PagesController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(":id"),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.CONTENT_MANAGER, client_1.UserRole.EDITOR),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_page_dto_1.UpdatePageDto, Object]),
    __metadata("design:returntype", void 0)
], PagesController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(":id/seo"),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.CONTENT_MANAGER),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_page_dto_1.UpdatePageDto, Object]),
    __metadata("design:returntype", void 0)
], PagesController.prototype, "updateSeo", null);
__decorate([
    (0, common_1.Put)(":id/sections-order"),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.CONTENT_MANAGER, client_1.UserRole.EDITOR),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", void 0)
], PagesController.prototype, "updateSectionsOrder", null);
__decorate([
    (0, common_1.Post)(":id/publish"),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.CONTENT_MANAGER),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __param(1, (0, user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], PagesController.prototype, "publish", null);
__decorate([
    (0, common_1.Post)(":id/unpublish"),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.CONTENT_MANAGER),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __param(1, (0, user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], PagesController.prototype, "unpublish", null);
__decorate([
    (0, common_1.Delete)(":id"),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.CONTENT_MANAGER),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __param(1, (0, user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], PagesController.prototype, "remove", null);
exports.PagesController = PagesController = __decorate([
    (0, common_1.Controller)("admin/pages"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [pages_service_1.PagesService,
        sections_service_1.SectionsService])
], PagesController);
//# sourceMappingURL=pages.controller.js.map