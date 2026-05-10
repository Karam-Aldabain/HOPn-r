import { Injectable, Logger } from "@nestjs/common";
import nodemailer from "nodemailer";
import { PrismaService } from "../../prisma/prisma.service";

export interface MailOptions {
  to: string | string[];
  subject: string;
  text: string;
  // "from" is optional — falls back to DB config or LEAD_NOTIFY_FROM env var
  from?: string;
}

/**
 * Shared mail service.
 *
 * SMTP config is read in priority order:
 *   1. The "integrations" row in the Setting table (configurable from the admin panel)
 *   2. Environment variables (SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_SECURE)
 *
 * If SMTP_HOST is missing from both sources, the service automatically falls back
 * to Ethereal Email (https://ethereal.email) — a free fake SMTP inbox by nodemailer.
 * A preview URL is logged so you can open it in the browser and read the captured email.
 * This makes local development work with zero config.
 */
@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  // Cached Ethereal test account so we only create one per server lifecycle
  private etherealAccount: { user: string; pass: string } | null = null;

  constructor(private readonly prisma: PrismaService) {}

  async sendMail(opts: MailOptions): Promise<boolean> {
    // --- Read config from DB (admin panel) or fall back to env vars ---
    const setting = await this.prisma.setting.findUnique({ where: { key: "integrations" } });
    const integrations = (setting?.valueJson as any) || {};
    const emailCfg = integrations.emailNotifications || {};
    const smtp = emailCfg.smtp || {};

    const host = smtp.host || process.env.SMTP_HOST;
    const from =
      opts.from ||
      emailCfg.from ||
      process.env.LEAD_NOTIFY_FROM ||
      "no-reply@hopn.local";

    let transporter: nodemailer.Transporter;

    if (!host) {
      // ---------------------------------------------------------------
      // No real SMTP configured → use Ethereal (dev/test fallback)
      // Ethereal is a fake SMTP server by the nodemailer team.
      // Emails are never actually delivered; they're captured and you
      // can read them at the URL logged below.
      // ---------------------------------------------------------------
      if (!this.etherealAccount) {
        this.etherealAccount = await nodemailer.createTestAccount();
        this.logger.warn(
          `No SMTP_HOST configured — using Ethereal test inbox (${this.etherealAccount.user})`,
        );
      }

      transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: this.etherealAccount.user,
          pass: this.etherealAccount.pass,
        },
      });
    } else {
      // Real SMTP — use whatever credentials are configured
      const port = Number(smtp.port || process.env.SMTP_PORT || 587);
      const user = smtp.user || process.env.SMTP_USER;
      const pass = smtp.pass || process.env.SMTP_PASS;
      const secure =
        typeof smtp.secure === "boolean"
          ? smtp.secure
          : String(process.env.SMTP_SECURE || "").toLowerCase() === "true";

      transporter = nodemailer.createTransport({
        host,
        port,
        secure,
        auth: user && pass ? { user, pass } : undefined,
      });
    }

    const info = await transporter.sendMail({
      from,
      to: opts.to,
      subject: opts.subject,
      text: opts.text,
    });

    // If we used Ethereal, log the URL where the email can be read in the browser
    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      this.logger.log(`[Mail] Preview URL: ${previewUrl}`);
    }

    return true;
  }
}
