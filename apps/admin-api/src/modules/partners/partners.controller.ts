import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  UseGuards,
} from "@nestjs/common";
import { PartnersService } from "./partners.service";
import { CreatePartnerDto } from "./dto/create-partner.dto";
import { UpdatePartnerDto } from "./dto/update-partner.dto";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { CurrentUser } from "../../common/decorators/user.decorator";
import { ReorderDto } from "../../common/dto/reorder.dto";
import { Roles } from "../../common/decorators/roles.decorator";
import { UserRole } from "@prisma/client";
import { UpdatePartnerSettingsDto } from "./dto/update-partner-settings.dto";

@Controller("admin/partners")
@UseGuards(JwtAuthGuard, RolesGuard)
export class PartnersController {
  constructor(private readonly partnersService: PartnersService) {}

  @Get()
  @Roles(UserRole.SUPER_ADMIN, UserRole.CONTENT_MANAGER, UserRole.EDITOR)
  findAll() {
    return this.partnersService.findAll();
  }

  @Get(":id")
  @Roles(UserRole.SUPER_ADMIN, UserRole.CONTENT_MANAGER, UserRole.EDITOR)
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.partnersService.findOne(id);
  }

  @Post()
  @Roles(UserRole.SUPER_ADMIN, UserRole.CONTENT_MANAGER, UserRole.EDITOR)
  create(@Body() dto: CreatePartnerDto, @CurrentUser() user: { id: number; role?: UserRole }) {
    return this.partnersService.create(dto, user?.id, user?.role);
  }

  @Patch(":id")
  @Roles(UserRole.SUPER_ADMIN, UserRole.CONTENT_MANAGER, UserRole.EDITOR)
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdatePartnerDto,
    @CurrentUser() user: { id: number; role?: UserRole },
  ) {
    return this.partnersService.update(id, dto, user?.id, user?.role);
  }

  @Delete(":id")
  @Roles(UserRole.SUPER_ADMIN, UserRole.CONTENT_MANAGER)
  remove(@Param("id", ParseIntPipe) id: number, @CurrentUser() user: { id: number }) {
    return this.partnersService.remove(id, user?.id);
  }

  @Post("reorder")
  @Roles(UserRole.SUPER_ADMIN, UserRole.CONTENT_MANAGER)
  reorder(@Body() dto: ReorderDto, @CurrentUser() user: { id: number }) {
    return this.partnersService.reorder(dto.ids, user?.id);
  }

  @Get("settings")
  @Roles(UserRole.SUPER_ADMIN, UserRole.CONTENT_MANAGER, UserRole.EDITOR)
  settings() {
    return this.partnersService.getSettings();
  }

  @Put("settings")
  @Roles(UserRole.SUPER_ADMIN, UserRole.CONTENT_MANAGER)
  updateSettings(
    @Body() dto: UpdatePartnerSettingsDto,
    @CurrentUser() user: { id: number },
  ) {
    return this.partnersService.updateSettings(dto, user?.id);
  }
}
