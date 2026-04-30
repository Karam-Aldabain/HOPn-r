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
import { NavService } from "./nav.service";
import { CreateNavItemDto } from "./dto/create-nav-item.dto";
import { UpdateNavItemDto } from "./dto/update-nav-item.dto";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { CurrentUser } from "../../common/decorators/user.decorator";
import { ReorderDto } from "../../common/dto/reorder.dto";
import { Roles } from "../../common/decorators/roles.decorator";
import { UserRole } from "@prisma/client";
import { UpdateNavigationDto } from "./dto/update-navigation.dto";

@Controller("admin/navigation")
@UseGuards(JwtAuthGuard, RolesGuard)
export class NavController {
  constructor(private readonly navService: NavService) {}

  @Get()
  @Roles(UserRole.SUPER_ADMIN, UserRole.CONTENT_MANAGER)
  findAll() {
    return this.navService.findAll();
  }

  @Get(":id")
  @Roles(UserRole.SUPER_ADMIN, UserRole.CONTENT_MANAGER)
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.navService.findOne(id);
  }

  @Post()
  @Roles(UserRole.SUPER_ADMIN, UserRole.CONTENT_MANAGER)
  create(@Body() dto: CreateNavItemDto, @CurrentUser() user: { id: number }) {
    return this.navService.create(dto, user?.id);
  }

  @Patch(":id")
  @Roles(UserRole.SUPER_ADMIN, UserRole.CONTENT_MANAGER)
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateNavItemDto,
    @CurrentUser() user: { id: number },
  ) {
    return this.navService.update(id, dto, user?.id);
  }

  @Delete(":id")
  @Roles(UserRole.SUPER_ADMIN, UserRole.CONTENT_MANAGER)
  remove(@Param("id", ParseIntPipe) id: number, @CurrentUser() user: { id: number }) {
    return this.navService.remove(id, user?.id);
  }

  @Post("reorder")
  @Roles(UserRole.SUPER_ADMIN, UserRole.CONTENT_MANAGER)
  reorder(@Body() dto: ReorderDto, @CurrentUser() user: { id: number }) {
    return this.navService.reorder(dto.ids, user?.id);
  }

  @Put("header")
  @Roles(UserRole.SUPER_ADMIN, UserRole.CONTENT_MANAGER)
  replaceHeader(@Body() dto: UpdateNavigationDto, @CurrentUser() user: { id: number }) {
    return this.navService.replaceNavigation("HEADER", dto.items || [], user?.id);
  }

  @Put("footer")
  @Roles(UserRole.SUPER_ADMIN, UserRole.CONTENT_MANAGER)
  replaceFooter(@Body() dto: UpdateNavigationDto, @CurrentUser() user: { id: number }) {
    return this.navService.replaceNavigation("FOOTER", dto.items || [], user?.id);
  }
}
