import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from "@nestjs/common";
import { SectionsService } from "./sections.service";
import { CreateSectionDto } from "./dto/create-section.dto";
import { UpdateSectionDto } from "./dto/update-section.dto";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { CurrentUser } from "../../common/decorators/user.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { UserRole } from "@prisma/client";

@Controller("admin")
@UseGuards(JwtAuthGuard, RolesGuard)
export class SectionsController {
  constructor(private readonly sectionsService: SectionsService) {}

  @Get("pages/:pageId/sections")
  @Roles(UserRole.SUPER_ADMIN, UserRole.CONTENT_MANAGER, UserRole.EDITOR)
  list(@Param("pageId", ParseIntPipe) pageId: number) {
    return this.sectionsService.listByPage(pageId);
  }

  @Get("sections/:id")
  @Roles(UserRole.SUPER_ADMIN, UserRole.CONTENT_MANAGER, UserRole.EDITOR)
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.sectionsService.findOne(id);
  }

  @Post("pages/:pageId/sections")
  @Roles(UserRole.SUPER_ADMIN, UserRole.CONTENT_MANAGER, UserRole.EDITOR)
  create(
    @Param("pageId", ParseIntPipe) pageId: number,
    @Body() dto: CreateSectionDto,
    @CurrentUser() user: { id: number },
  ) {
    return this.sectionsService.create({ ...dto, pageId }, user?.id);
  }

  @Put("sections/:id")
  @Roles(UserRole.SUPER_ADMIN, UserRole.CONTENT_MANAGER, UserRole.EDITOR)
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateSectionDto,
    @CurrentUser() user: { id: number },
  ) {
    return this.sectionsService.update(id, dto, user?.id);
  }

  @Delete("sections/:id")
  @Roles(UserRole.SUPER_ADMIN, UserRole.CONTENT_MANAGER)
  remove(@Param("id", ParseIntPipe) id: number, @CurrentUser() user: { id: number }) {
    return this.sectionsService.remove(id, user?.id);
  }
}
