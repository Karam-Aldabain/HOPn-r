import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Res,
  UseGuards,
} from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import { LeadsService } from "./leads.service";
import { CreateLeadDto } from "./dto/create-lead.dto";
import { UpdateLeadStatusDto } from "./dto/update-lead-status.dto";
import { CreateLeadNoteDto } from "./dto/create-lead-note.dto";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { CurrentUser } from "../../common/decorators/user.decorator";
import type { Response } from "express";
import { Roles } from "../../common/decorators/roles.decorator";
import { UserRole } from "@prisma/client";

@Controller()
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @Post("leads")
  @Throttle({ default: { limit: 10, ttl: 60 } })
  create(@Body() dto: CreateLeadDto) {
    return this.leadsService.create(dto);
  }

  @Get("admin/leads")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.MARKETING_CRM_MANAGER, UserRole.CONTENT_MANAGER)
  findAll(
    @Query("status") status?: string,
    @Query("topic") topic?: string,
    @Query("from") from?: string,
    @Query("to") to?: string,
  ) {
    return this.leadsService.findAll({ status, topic, from, to });
  }

  @Get("admin/leads/export.csv")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.MARKETING_CRM_MANAGER)
  async exportCsv(
    @Res() res: Response,
    @Query("status") status?: string,
    @Query("topic") topic?: string,
    @Query("from") from?: string,
    @Query("to") to?: string,
  ) {
    const leads = await this.leadsService.findAll({ status, topic, from, to });
    const headers = [
      "id",
      "name",
      "email",
      "company",
      "topic",
      "message",
      "consent",
      "status",
      "notes",
      "createdAt",
    ];
    const lines = [
      headers.join(","),
      ...leads.map((l) =>
        headers
          .map((h) => {
            let value = (l as any)[h];
            if (h === "notes" && Array.isArray((l as any).notes)) {
              value = (l as any).notes.map((n: any) => n.body).join(" | ");
            }
            const safe = String(value ?? "").replace(/"/g, '""');
            return `"${safe}"`;
          })
          .join(","),
      ),
    ];
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=leads.csv");
    res.send(lines.join("\n"));
  }

  @Get("admin/leads/:id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.MARKETING_CRM_MANAGER, UserRole.CONTENT_MANAGER)
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.leadsService.findOne(id);
  }

  @Put("admin/leads/:id/status")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.MARKETING_CRM_MANAGER)
  updateStatus(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateLeadStatusDto,
    @CurrentUser() user: { id: number },
  ) {
    return this.leadsService.updateStatus(id, dto.status, user?.id);
  }

  @Post("admin/leads/:id/notes")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.MARKETING_CRM_MANAGER)
  addNote(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: CreateLeadNoteDto,
    @CurrentUser() user: { id: number },
  ) {
    return this.leadsService.addNote(id, dto.body, user?.id);
  }

  @Delete("admin/leads/:id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  remove(@Param("id", ParseIntPipe) id: number, @CurrentUser() user: { id: number }) {
    return this.leadsService.remove(id, user?.id);
  }
}
