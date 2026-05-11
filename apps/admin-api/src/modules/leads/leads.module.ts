import { Module } from "@nestjs/common";
import { LeadsService } from "./leads.service";
import { LeadsController } from "./leads.controller";
import { AuditModule } from "../audit/audit.module";
import { MailModule } from "../../common/mail/mail.module";

@Module({
  imports: [AuditModule, MailModule],
  providers: [LeadsService],
  controllers: [LeadsController],
})
export class LeadsModule {}
