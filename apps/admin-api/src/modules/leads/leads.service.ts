import { Injectable } from "@nestjs/common";
import nodemailer from "nodemailer";
import { PrismaService } from "../../prisma/prisma.service";
import { AuditService } from "../audit/audit.service";
import { CreateLeadDto } from "./dto/create-lead.dto";
import { LeadStatus } from "@prisma/client";

@Injectable()
export class LeadsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  findAll(filters: { status?: string; topic?: string; from?: string; to?: string }) {
    const where: any = {};
    if (filters.status) where.status = filters.status as LeadStatus;
    if (filters.topic) where.topic = filters.topic;
    if (filters.from || filters.to) {
      where.createdAt = {};
      if (filters.from) where.createdAt.gte = new Date(filters.from);
      if (filters.to) where.createdAt.lte = new Date(filters.to);
    }
    return this.prisma.leadSubmission.findMany({
      where,
      include: {
        notes: { orderBy: { createdAt: "desc" } },
        statusHistory: { orderBy: { changedAt: "desc" } },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  findOne(id: number) {
    return this.prisma.leadSubmission.findUnique({
      where: { id },
      include: {
        notes: { orderBy: { createdAt: "desc" } },
        statusHistory: { orderBy: { changedAt: "desc" } },
      },
    });
  }

  async create(dto: CreateLeadDto) {
    await this.verifyCaptcha(dto.captchaToken);
    const { captchaToken, ...data } = dto;
    const lead = await this.prisma.leadSubmission.create({ data });
    await this.prisma.leadStatusHistory.create({
      data: {
        leadId: lead.id,
        fromStatus: null,
        toStatus: lead.status,
      },
    });
    this.sendLeadNotification(lead).catch(() => {});
    return lead;
  }

  async updateStatus(id: number, status: LeadStatus, userId?: number) {
    const existing = await this.prisma.leadSubmission.findUnique({ where: { id } });
    const lead = await this.prisma.leadSubmission.update({
      where: { id },
      data: { status },
    });
    await this.prisma.leadStatusHistory.create({
      data: {
        leadId: lead.id,
        fromStatus: existing?.status ?? null,
        toStatus: status,
        changedBy: userId ?? null,
      },
    });
    await this.audit.create({
      entityType: "LeadSubmission",
      entityId: String(lead.id),
      action: "status_update",
      diffJson: { status },
      changedBy: userId,
    });
    return lead;
  }

  async addNote(id: number, body: string, userId?: number) {
    const note = await this.prisma.leadNote.create({
      data: { leadId: id, body, createdBy: userId ?? null },
    });
    await this.audit.create({
      entityType: "LeadSubmission",
      entityId: String(id),
      action: "note_add",
      diffJson: { body },
      changedBy: userId,
    });
    return note;
  }

  async remove(id: number, userId?: number) {
    const lead = await this.prisma.leadSubmission.delete({ where: { id } });
    await this.audit.create({
      entityType: "LeadSubmission",
      entityId: String(lead.id),
      action: "delete",
      changedBy: userId,
    });
    return lead;
  }

  private async sendLeadNotification(lead: {
    id: number;
    name: string;
    email: string;
    company?: string | null;
    topic: string;
    message: string;
    createdAt: Date;
  }) {
    const setting = await this.prisma.setting.findUnique({ where: { key: "integrations" } });
    const integrations = (setting?.valueJson as any) || {};
    const emailCfg = integrations.emailNotifications || {};

    const enabled =
      typeof emailCfg.enabled === "boolean"
        ? emailCfg.enabled
        : String(process.env.LEAD_NOTIFY_ENABLED || "").toLowerCase() !== "false";
    if (!enabled) return;

    const toRaw = emailCfg.to || process.env.LEAD_NOTIFY_TO || "info@hopn.eu";
    const toList = Array.isArray(toRaw)
      ? toRaw.filter(Boolean)
      : String(toRaw)
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean);
    if (!toList.length) return;

    const from = emailCfg.from || process.env.LEAD_NOTIFY_FROM || "no-reply@hopn.local";

    const smtp = emailCfg.smtp || {};
    const host = smtp.host || process.env.SMTP_HOST;
    const port = Number(smtp.port || process.env.SMTP_PORT || 587);
    const user = smtp.user || process.env.SMTP_USER;
    const pass = smtp.pass || process.env.SMTP_PASS;
    const secure =
      typeof smtp.secure === "boolean"
        ? smtp.secure
        : String(process.env.SMTP_SECURE || "").toLowerCase() === "true";

    if (!host) return;

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: user && pass ? { user, pass } : undefined,
    });

    const subject =
      emailCfg.subject || `New lead: ${lead.name} (${lead.topic})`;
    const lines = [
      `Name: ${lead.name}`,
      `Email: ${lead.email}`,
      `Company: ${lead.company || "-"}`,
      `Topic: ${lead.topic}`,
      `Message:`,
      lead.message,
      "",
      `Lead ID: ${lead.id}`,
      `Submitted: ${lead.createdAt.toISOString()}`,
    ];

    await transporter.sendMail({
      from,
      to: toList,
      subject,
      text: lines.join("\n"),
    });
  }

  private async verifyCaptcha(token?: string) {
    const setting = await this.prisma.setting.findUnique({ where: { key: "captcha_public" } });
    const cfg = (setting?.valueJson as any) || {};
    const enabled = cfg.enabled === true;
    if (!enabled) return;

    const provider = (cfg.provider || "recaptcha").toString();
    if (provider !== "recaptcha") return;

    const secret = process.env.RECAPTCHA_SECRET || "";
    if (!secret) return;

    if (!token) {
      throw new Error("Captcha token missing");
    }

    const params = new URLSearchParams();
    params.set("secret", secret);
    params.set("response", token);

    const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    });
    const json = (await res.json()) as { success?: boolean };
    if (!json?.success) {
      throw new Error("Captcha verification failed");
    }
  }
}
