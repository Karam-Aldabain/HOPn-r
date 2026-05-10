import { Module } from "@nestjs/common";
import { MailService } from "./mail.service";

/**
 * Import this module wherever you need to send email.
 * It exports MailService so the importing module's providers can inject it.
 */
@Module({
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
