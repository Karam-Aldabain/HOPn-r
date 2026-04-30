import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "./modules/auth/auth.module";
import { UsersModule } from "./modules/users/users.module";
import { PagesModule } from "./modules/pages/pages.module";
import { SectionsModule } from "./modules/sections/sections.module";
import { SolutionsModule } from "./modules/solutions/solutions.module";
import { ProjectsModule } from "./modules/projects/projects.module";
import { PartnersModule } from "./modules/partners/partners.module";
import { TeamModule } from "./modules/team/team.module";
import { LeadsModule } from "./modules/leads/leads.module";
import { MediaModule } from "./modules/media/media.module";
import { AuditModule } from "./modules/audit/audit.module";
import { SettingsModule } from "./modules/settings/settings.module";
import { NavModule } from "./modules/nav/nav.module";
import { PublicModule } from "./modules/public/public.module";
import { PrismaModule } from "./prisma/prisma.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), "apps", "admin-api", "uploads"),
      serveRoot: "/uploads",
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60,
        limit: 120,
      },
    ]),
    PrismaModule,
    AuthModule,
    UsersModule,
    PagesModule,
    SectionsModule,
    SolutionsModule,
    ProjectsModule,
    PartnersModule,
    TeamModule,
    LeadsModule,
    MediaModule,
    AuditModule,
    SettingsModule,
    NavModule,
    PublicModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
