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
import { TeamService } from "./team.service";
import { CreateTeamMemberDto } from "./dto/create-team-member.dto";
import { UpdateTeamMemberDto } from "./dto/update-team-member.dto";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { CurrentUser } from "../../common/decorators/user.decorator";
import { ReorderDto } from "../../common/dto/reorder.dto";
import { Roles } from "../../common/decorators/roles.decorator";
import { UserRole } from "@prisma/client";

@Controller("admin/team")
@UseGuards(JwtAuthGuard, RolesGuard)
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Get()
  @Roles(UserRole.SUPER_ADMIN, UserRole.CONTENT_MANAGER, UserRole.EDITOR)
  findAll() {
    return this.teamService.findAll();
  }

  @Get(":id")
  @Roles(UserRole.SUPER_ADMIN, UserRole.CONTENT_MANAGER, UserRole.EDITOR)
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.teamService.findOne(id);
  }

  @Post()
  @Roles(UserRole.SUPER_ADMIN, UserRole.CONTENT_MANAGER, UserRole.EDITOR)
  create(@Body() dto: CreateTeamMemberDto, @CurrentUser() user: { id: number; role?: UserRole }) {
    return this.teamService.create(dto, user?.id, user?.role);
  }

  @Patch(":id")
  @Roles(UserRole.SUPER_ADMIN, UserRole.CONTENT_MANAGER, UserRole.EDITOR)
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateTeamMemberDto,
    @CurrentUser() user: { id: number; role?: UserRole },
  ) {
    return this.teamService.update(id, dto, user?.id, user?.role);
  }

  @Delete(":id")
  @Roles(UserRole.SUPER_ADMIN, UserRole.CONTENT_MANAGER)
  remove(@Param("id", ParseIntPipe) id: number, @CurrentUser() user: { id: number }) {
    return this.teamService.remove(id, user?.id);
  }

  @Post("reorder")
  @Roles(UserRole.SUPER_ADMIN, UserRole.CONTENT_MANAGER)
  reorder(@Body() dto: ReorderDto, @CurrentUser() user: { id: number }) {
    return this.teamService.reorder(dto.ids, user?.id);
  }
}
