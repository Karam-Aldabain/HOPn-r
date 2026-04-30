import { Module } from "@nestjs/common";
import { PagesService } from "./pages.service";
import { PagesController } from "./pages.controller";
import { AuditModule } from "../audit/audit.module";
import { SectionsModule } from "../sections/sections.module";

@Module({
  imports: [AuditModule, SectionsModule],
  providers: [PagesService],
  controllers: [PagesController],
})
export class PagesModule {}
