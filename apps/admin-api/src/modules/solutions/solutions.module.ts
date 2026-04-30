import { Module } from "@nestjs/common";
import { SolutionsService } from "./solutions.service";
import { SolutionsController } from "./solutions.controller";
import { AuditModule } from "../audit/audit.module";

@Module({
  imports: [AuditModule],
  providers: [SolutionsService],
  controllers: [SolutionsController],
})
export class SolutionsModule {}
