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
import { SolutionsService } from "./solutions.service";
import { CreateSolutionDto } from "./dto/create-solution.dto";
import { UpdateSolutionDto } from "./dto/update-solution.dto";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { CurrentUser } from "../../common/decorators/user.decorator";
import { ReorderDto } from "../../common/dto/reorder.dto";
import { Roles } from "../../common/decorators/roles.decorator";
import { UserRole } from "@prisma/client";

@Controller("admin/solutions")
@UseGuards(JwtAuthGuard, RolesGuard)
export class SolutionsController {
  constructor(private readonly solutionsService: SolutionsService) {}

  @Get()
  @Roles(UserRole.SUPER_ADMIN, UserRole.CONTENT_MANAGER, UserRole.EDITOR)
  findAll() {
    return this.solutionsService.findAll();
  }

  @Get(":id")
  @Roles(UserRole.SUPER_ADMIN, UserRole.CONTENT_MANAGER, UserRole.EDITOR)
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.solutionsService.findOne(id);
  }

  @Post()
  @Roles(UserRole.SUPER_ADMIN, UserRole.CONTENT_MANAGER, UserRole.EDITOR)
  create(@Body() dto: CreateSolutionDto, @CurrentUser() user: { id: number; role?: UserRole }) {
    return this.solutionsService.create(dto, user?.id, user?.role);
  }

  @Patch(":id")
  @Roles(UserRole.SUPER_ADMIN, UserRole.CONTENT_MANAGER, UserRole.EDITOR)
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateSolutionDto,
    @CurrentUser() user: { id: number; role?: UserRole },
  ) {
    return this.solutionsService.update(id, dto, user?.id, user?.role);
  }

  @Delete(":id")
  @Roles(UserRole.SUPER_ADMIN, UserRole.CONTENT_MANAGER)
  remove(@Param("id", ParseIntPipe) id: number, @CurrentUser() user: { id: number }) {
    return this.solutionsService.remove(id, user?.id);
  }

  @Post("reorder")
  @Roles(UserRole.SUPER_ADMIN, UserRole.CONTENT_MANAGER)
  reorder(@Body() dto: ReorderDto, @CurrentUser() user: { id: number }) {
    return this.solutionsService.reorder(dto.ids, user?.id);
  }
}
