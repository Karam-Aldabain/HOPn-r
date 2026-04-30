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
exports.PublicController = void 0;
const common_1 = require("@nestjs/common");
const public_service_1 = require("./public.service");
let PublicController = class PublicController {
    publicService;
    constructor(publicService) {
        this.publicService = publicService;
    }
    listPages() {
        return this.publicService.listPages();
    }
    getPageBySlug(slug) {
        return this.publicService.getPageBySlug(slug);
    }
    listSolutions(visible) {
        const visibleBool = visible === "true" ? true : visible === "false" ? false : undefined;
        return this.publicService.listSolutions(visibleBool);
    }
    listProjects(published, featured, industry, tech) {
        const publishedBool = published === "true" ? true : published === "false" ? false : undefined;
        const featuredBool = featured === "true" ? true : featured === "false" ? false : undefined;
        return this.publicService.listProjects({
            published: publishedBool,
            featured: featuredBool,
            industry,
            tech,
        });
    }
    listPartners(visible) {
        const visibleBool = visible === "true" ? true : visible === "false" ? false : undefined;
        return this.publicService.listPartners(visibleBool);
    }
    partnerSettings() {
        return this.publicService.getPartnerSettings();
    }
    listTeam(visible) {
        const visibleBool = visible === "true" ? true : visible === "false" ? false : undefined;
        return this.publicService.listTeam(visibleBool);
    }
    listNav() {
        return this.publicService.listNav();
    }
    getSetting(key) {
        return this.publicService.getSetting(key);
    }
};
exports.PublicController = PublicController;
__decorate([
    (0, common_1.Get)("pages"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PublicController.prototype, "listPages", null);
__decorate([
    (0, common_1.Get)("pages/:slug"),
    __param(0, (0, common_1.Param)("slug")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PublicController.prototype, "getPageBySlug", null);
__decorate([
    (0, common_1.Get)("solutions"),
    __param(0, (0, common_1.Query)("visible")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PublicController.prototype, "listSolutions", null);
__decorate([
    (0, common_1.Get)("projects"),
    __param(0, (0, common_1.Query)("published")),
    __param(1, (0, common_1.Query)("featured")),
    __param(2, (0, common_1.Query)("industry")),
    __param(3, (0, common_1.Query)("tech")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", void 0)
], PublicController.prototype, "listProjects", null);
__decorate([
    (0, common_1.Get)("partners"),
    __param(0, (0, common_1.Query)("visible")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PublicController.prototype, "listPartners", null);
__decorate([
    (0, common_1.Get)("partners/settings"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PublicController.prototype, "partnerSettings", null);
__decorate([
    (0, common_1.Get)("team"),
    __param(0, (0, common_1.Query)("visible")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PublicController.prototype, "listTeam", null);
__decorate([
    (0, common_1.Get)("navigation"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PublicController.prototype, "listNav", null);
__decorate([
    (0, common_1.Get)("settings/public"),
    __param(0, (0, common_1.Query)("key")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PublicController.prototype, "getSetting", null);
exports.PublicController = PublicController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [public_service_1.PublicService])
], PublicController);
//# sourceMappingURL=public.controller.js.map