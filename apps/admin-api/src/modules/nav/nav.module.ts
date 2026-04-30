import { Module } from "@nestjs/common";
import { NavService } from "./nav.service";
import { NavController } from "./nav.controller";
import { AuditModule } from "../audit/audit.module";

@Module({
  imports: [AuditModule],
  providers: [NavService],
  controllers: [NavController],
})
export class NavModule {}
