import { Module } from "@nestjs/common";
import { TeamService } from "./team.service";
import { TeamController } from "./team.controller";
import { AuditModule } from "../audit/audit.module";

@Module({
  imports: [AuditModule],
  providers: [TeamService],
  controllers: [TeamController],
})
export class TeamModule {}
