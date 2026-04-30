import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  UseGuards,
} from "@nestjs/common";
import { SettingsService } from "./settings.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { CurrentUser } from "../../common/decorators/user.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { UserRole } from "@prisma/client";

@Controller("admin/settings")
@UseGuards(JwtAuthGuard, RolesGuard)
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  @Roles(UserRole.SUPER_ADMIN, UserRole.TECHNICAL_ADMIN)
  findAll(@CurrentUser() user: { role?: UserRole }) {
    if (user?.role === UserRole.TECHNICAL_ADMIN) {
      return this.settingsService.findOne("integrations").then((s) => (s ? [s] : []));
    }
    return this.settingsService.findAll();
  }

  @Get(":key")
  @Roles(UserRole.SUPER_ADMIN, UserRole.TECHNICAL_ADMIN)
  findOne(@Param("key") key: string, @CurrentUser() user: { role?: UserRole }) {
    if (user?.role === UserRole.TECHNICAL_ADMIN && key !== "integrations") {
      return null;
    }
    return this.settingsService.findOne(key);
  }

  @Put()
  @Roles(UserRole.SUPER_ADMIN, UserRole.TECHNICAL_ADMIN)
  update(
    @Body() dto: { key: string; valueJson: any },
    @CurrentUser() user: { id: number; role?: UserRole },
  ) {
    return this.settingsService.upsert(dto.key, dto.valueJson, user?.id, user?.role);
  }
}
