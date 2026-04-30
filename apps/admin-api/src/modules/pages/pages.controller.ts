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
import { PagesService } from "./pages.service";
import { CreatePageDto } from "./dto/create-page.dto";
import { UpdatePageDto } from "./dto/update-page.dto";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { CurrentUser } from "../../common/decorators/user.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { UserRole } from "@prisma/client";
import { SectionsService } from "../sections/sections.service";

@Controller("admin/pages")
@UseGuards(JwtAuthGuard, RolesGuard)
export class PagesController {
  constructor(
    private readonly pagesService: PagesService,
    private readonly sectionsService: SectionsService,
  ) {}

  @Get()
  @Roles(UserRole.SUPER_ADMIN, UserRole.CONTENT_MANAGER, UserRole.EDITOR)
  findAll() {
    return this.pagesService.findAll();
  }

  @Get(":id")
  @Roles(UserRole.SUPER_ADMIN, UserRole.CONTENT_MANAGER, UserRole.EDITOR)
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.pagesService.findOne(id);
  }

  @Post()
  @Roles(UserRole.SUPER_ADMIN, UserRole.CONTENT_MANAGER, UserRole.EDITOR)
  create(@Body() dto: CreatePageDto, @CurrentUser() user: { id: number; role?: UserRole }) {
    return this.pagesService.create(dto, user?.id, user?.role);
  }

  @Patch(":id")
  @Roles(UserRole.SUPER_ADMIN, UserRole.CONTENT_MANAGER, UserRole.EDITOR)
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdatePageDto,
    @CurrentUser() user: { id: number; role?: UserRole },
  ) {
    return this.pagesService.update(id, dto, user?.id, user?.role);
  }

  @Patch(":id/seo")
  @Roles(UserRole.SUPER_ADMIN, UserRole.CONTENT_MANAGER)
  updateSeo(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdatePageDto,
    @CurrentUser() user: { id: number },
  ) {
    return this.pagesService.updateSeo(id, dto, user?.id);
  }

  @Put(":id/sections-order")
  @Roles(UserRole.SUPER_ADMIN, UserRole.CONTENT_MANAGER, UserRole.EDITOR)
  updateSectionsOrder(
    @Param("id", ParseIntPipe) id: number,
    @Body() body: { sectionIds: number[] },
    @CurrentUser() user: { id: number },
  ) {
    return this.sectionsService.reorder(id, body.sectionIds || [], user?.id);
  }

  @Post(":id/publish")
  @Roles(UserRole.SUPER_ADMIN, UserRole.CONTENT_MANAGER)
  publish(@Param("id", ParseIntPipe) id: number, @CurrentUser() user: { id: number }) {
    return this.pagesService.publish(id, user?.id);
  }

  @Post(":id/unpublish")
  @Roles(UserRole.SUPER_ADMIN, UserRole.CONTENT_MANAGER)
  unpublish(@Param("id", ParseIntPipe) id: number, @CurrentUser() user: { id: number }) {
    return this.pagesService.unpublish(id, user?.id);
  }

  @Delete(":id")
  @Roles(UserRole.SUPER_ADMIN, UserRole.CONTENT_MANAGER)
  remove(@Param("id", ParseIntPipe) id: number, @CurrentUser() user: { id: number }) {
    return this.pagesService.remove(id, user?.id);
  }
}
