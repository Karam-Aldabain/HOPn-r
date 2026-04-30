import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { ProjectsService } from "./projects.service";
import { CreateProjectDto } from "./dto/create-project.dto";
import { UpdateProjectDto } from "./dto/update-project.dto";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { CurrentUser } from "../../common/decorators/user.decorator";
import { ReorderDto } from "../../common/dto/reorder.dto";
import { Roles } from "../../common/decorators/roles.decorator";
import { UserRole } from "@prisma/client";

@Controller("admin/projects")
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  @Roles(UserRole.SUPER_ADMIN, UserRole.CONTENT_MANAGER, UserRole.EDITOR)
  findAll() {
    return this.projectsService.findAll();
  }

  @Get(":id")
  @Roles(UserRole.SUPER_ADMIN, UserRole.CONTENT_MANAGER, UserRole.EDITOR)
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.projectsService.findOne(id);
  }

  @Post()
  @Roles(UserRole.SUPER_ADMIN, UserRole.CONTENT_MANAGER, UserRole.EDITOR)
  create(@Body() dto: CreateProjectDto, @CurrentUser() user: { id: number; role?: UserRole }) {
    return this.projectsService.create(dto, user?.id, user?.role);
  }

  @Patch(":id")
  @Roles(UserRole.SUPER_ADMIN, UserRole.CONTENT_MANAGER, UserRole.EDITOR)
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateProjectDto,
    @CurrentUser() user: { id: number; role?: UserRole },
  ) {
    return this.projectsService.update(id, dto, user?.id, user?.role);
  }

  @Delete(":id")
  @Roles(UserRole.SUPER_ADMIN, UserRole.CONTENT_MANAGER)
  remove(@Param("id", ParseIntPipe) id: number, @CurrentUser() user: { id: number }) {
    return this.projectsService.remove(id, user?.id);
  }

  @Post("reorder")
  @Roles(UserRole.SUPER_ADMIN, UserRole.CONTENT_MANAGER)
  reorder(@Body() dto: ReorderDto, @CurrentUser() user: { id: number }) {
    return this.projectsService.reorder(dto.ids, user?.id);
  }
}
