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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var MailService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailService = void 0;
const common_1 = require("@nestjs/common");
const nodemailer_1 = __importDefault(require("nodemailer"));
const prisma_service_1 = require("../../prisma/prisma.service");
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
let MailService = MailService_1 = class MailService {
    prisma;
    logger = new common_1.Logger(MailService_1.name);
    // Cached Ethereal test account so we only create one per server lifecycle
    etherealAccount = null;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async sendMail(opts) {
        // --- Read config from DB (admin panel) or fall back to env vars ---
        const setting = await this.prisma.setting.findUnique({ where: { key: "integrations" } });
        const integrations = setting?.valueJson || {};
        const emailCfg = integrations.emailNotifications || {};
        const smtp = emailCfg.smtp || {};
        const host = smtp.host || process.env.SMTP_HOST;
        const from = opts.from ||
            emailCfg.from ||
            process.env.LEAD_NOTIFY_FROM ||
            "no-reply@hopn.local";
        let transporter;
        if (!host) {
            // ---------------------------------------------------------------
            // No real SMTP configured → use Ethereal (dev/test fallback)
            // Ethereal is a fake SMTP server by the nodemailer team.
            // Emails are never actually delivered; they're captured and you
            // can read them at the URL logged below.
            // ---------------------------------------------------------------
            if (!this.etherealAccount) {
                this.etherealAccount = await nodemailer_1.default.createTestAccount();
                this.logger.warn(`No SMTP_HOST configured — using Ethereal test inbox (${this.etherealAccount.user})`);
            }
            transporter = nodemailer_1.default.createTransport({
                host: "smtp.ethereal.email",
                port: 587,
                secure: false,
                auth: {
                    user: this.etherealAccount.user,
                    pass: this.etherealAccount.pass,
                },
            });
        }
        else {
            // Real SMTP — use whatever credentials are configured
            const port = Number(smtp.port || process.env.SMTP_PORT || 587);
            const user = smtp.user || process.env.SMTP_USER;
            const pass = smtp.pass || process.env.SMTP_PASS;
            const secure = typeof smtp.secure === "boolean"
                ? smtp.secure
                : String(process.env.SMTP_SECURE || "").toLowerCase() === "true";
            transporter = nodemailer_1.default.createTransport({
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
        const previewUrl = nodemailer_1.default.getTestMessageUrl(info);
        if (previewUrl) {
            this.logger.log(`[Mail] Preview URL: ${previewUrl}`);
        }
        return true;
    }
};
exports.MailService = MailService;
exports.MailService = MailService = MailService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MailService);
//# sourceMappingURL=mail.service.js.map