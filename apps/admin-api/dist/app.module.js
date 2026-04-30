"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const throttler_1 = require("@nestjs/throttler");
const serve_static_1 = require("@nestjs/serve-static");
const path_1 = require("path");
const config_1 = require("@nestjs/config");
const auth_module_1 = require("./modules/auth/auth.module");
const users_module_1 = require("./modules/users/users.module");
const pages_module_1 = require("./modules/pages/pages.module");
const sections_module_1 = require("./modules/sections/sections.module");
const solutions_module_1 = require("./modules/solutions/solutions.module");
const projects_module_1 = require("./modules/projects/projects.module");
const partners_module_1 = require("./modules/partners/partners.module");
const team_module_1 = require("./modules/team/team.module");
const leads_module_1 = require("./modules/leads/leads.module");
const media_module_1 = require("./modules/media/media.module");
const audit_module_1 = require("./modules/audit/audit.module");
const settings_module_1 = require("./modules/settings/settings.module");
const nav_module_1 = require("./modules/nav/nav.module");
const public_module_1 = require("./modules/public/public.module");
const prisma_module_1 = require("./prisma/prisma.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            serve_static_1.ServeStaticModule.forRoot({
                rootPath: (0, path_1.join)(process.cwd(), "apps", "admin-api", "uploads"),
                serveRoot: "/uploads",
            }),
            throttler_1.ThrottlerModule.forRoot([
                {
                    ttl: 60,
                    limit: 120,
                },
            ]),
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            pages_module_1.PagesModule,
            sections_module_1.SectionsModule,
            solutions_module_1.SolutionsModule,
            projects_module_1.ProjectsModule,
            partners_module_1.PartnersModule,
            team_module_1.TeamModule,
            leads_module_1.LeadsModule,
            media_module_1.MediaModule,
            audit_module_1.AuditModule,
            settings_module_1.SettingsModule,
            nav_module_1.NavModule,
            public_module_1.PublicModule,
        ],
        providers: [
            {
                provide: core_1.APP_GUARD,
                useClass: throttler_1.ThrottlerGuard,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map