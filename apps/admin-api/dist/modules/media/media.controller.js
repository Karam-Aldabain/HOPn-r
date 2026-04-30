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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const fs_1 = require("fs");
const path_1 = require("path");
const sharp_1 = __importDefault(require("sharp"));
const media_service_1 = require("./media.service");
const create_media_dto_1 = require("./dto/create-media.dto");
const update_media_dto_1 = require("./dto/update-media.dto");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const user_decorator_1 = require("../../common/decorators/user.decorator");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const client_1 = require("@prisma/client");
let MediaController = class MediaController {
    mediaService;
    constructor(mediaService) {
        this.mediaService = mediaService;
    }
    findAll() {
        return this.mediaService.findAll();
    }
    findOne(id) {
        return this.mediaService.findOne(id);
    }
    create(dto, user) {
        return this.mediaService.create(dto, user?.id);
    }
    async upload(file, altText, user, tags) {
        const tagList = tags ? tags.split(",").map((t) => t.trim()).filter(Boolean) : [];
        if (!file) {
            return { error: "No file uploaded" };
        }
        if (!altText) {
            return { error: "altText is required" };
        }
        const isImage = file.mimetype.startsWith("image/");
        let fileUrl = `/uploads/originals/${file.filename}`;
        let type = file.mimetype;
        if (isImage) {
            const optimizedDir = (0, path_1.join)(process.cwd(), "apps", "admin-api", "uploads", "optimized");
            if (!(0, fs_1.existsSync)(optimizedDir))
                (0, fs_1.mkdirSync)(optimizedDir, { recursive: true });
            const webpName = file.filename.replace((0, path_1.extname)(file.filename), ".webp");
            const outPath = (0, path_1.join)(optimizedDir, webpName);
            await (0, sharp_1.default)(file.path).webp({ quality: 82 }).toFile(outPath);
            fileUrl = `/uploads/optimized/${webpName}`;
            type = "image/webp";
        }
        return this.mediaService.create({ fileUrl, type, altText, tags: tagList }, user?.id);
    }
    update(id, dto, user) {
        return this.mediaService.update(id, dto, user?.id);
    }
    remove(id, user) {
        return this.mediaService.remove(id, user?.id);
    }
};
exports.MediaController = MediaController;
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.CONTENT_MANAGER, client_1.UserRole.EDITOR),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MediaController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(":id"),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.CONTENT_MANAGER, client_1.UserRole.EDITOR),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], MediaController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.CONTENT_MANAGER),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_media_dto_1.CreateMediaDto, Object]),
    __metadata("design:returntype", void 0)
], MediaController.prototype, "create", null);
__decorate([
    (0, common_1.Post)("upload"),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.CONTENT_MANAGER, client_1.UserRole.EDITOR),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)("file", {
        storage: (0, multer_1.diskStorage)({
            destination: (_req, _file, cb) => {
                const root = (0, path_1.join)(process.cwd(), "apps", "admin-api", "uploads", "originals");
                if (!(0, fs_1.existsSync)(root))
                    (0, fs_1.mkdirSync)(root, { recursive: true });
                cb(null, root);
            },
            filename: (_req, file, cb) => {
                const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
                cb(null, `${unique}${(0, path_1.extname)(file.originalname)}`);
            },
        }),
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)("altText")),
    __param(2, (0, user_decorator_1.CurrentUser)()),
    __param(3, (0, common_1.Body)("tags")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object, String]),
    __metadata("design:returntype", Promise)
], MediaController.prototype, "upload", null);
__decorate([
    (0, common_1.Patch)(":id"),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.CONTENT_MANAGER),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_media_dto_1.UpdateMediaDto, Object]),
    __metadata("design:returntype", void 0)
], MediaController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(":id"),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.CONTENT_MANAGER),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __param(1, (0, user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], MediaController.prototype, "remove", null);
exports.MediaController = MediaController = __decorate([
    (0, common_1.Controller)("admin/media"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [media_service_1.MediaService])
], MediaController);
//# sourceMappingURL=media.controller.js.map