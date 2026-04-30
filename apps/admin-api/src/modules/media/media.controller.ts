import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { existsSync, mkdirSync } from "fs";
import { extname, join } from "path";
import sharp from "sharp";
import type { Request } from "express";
import { MediaService } from "./media.service";
import { CreateMediaDto } from "./dto/create-media.dto";
import { UpdateMediaDto } from "./dto/update-media.dto";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { CurrentUser } from "../../common/decorators/user.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { UserRole } from "@prisma/client";

@Controller("admin/media")
@UseGuards(JwtAuthGuard, RolesGuard)
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Get()
  @Roles(UserRole.SUPER_ADMIN, UserRole.CONTENT_MANAGER, UserRole.EDITOR)
  findAll() {
    return this.mediaService.findAll();
  }

  @Get(":id")
  @Roles(UserRole.SUPER_ADMIN, UserRole.CONTENT_MANAGER, UserRole.EDITOR)
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.mediaService.findOne(id);
  }

  @Post()
  @Roles(UserRole.SUPER_ADMIN, UserRole.CONTENT_MANAGER)
  create(@Body() dto: CreateMediaDto, @CurrentUser() user: { id: number }) {
    return this.mediaService.create(dto, user?.id);
  }

  @Post("upload")
  @Roles(UserRole.SUPER_ADMIN, UserRole.CONTENT_MANAGER, UserRole.EDITOR)
  @UseInterceptors(
    FileInterceptor("file", {
      storage: diskStorage({
        destination: (
          _req: Request,
          _file: Express.Multer.File,
          cb: (error: Error | null, destination: string) => void,
        ) => {
          const root = join(process.cwd(), "apps", "admin-api", "uploads", "originals");
          if (!existsSync(root)) mkdirSync(root, { recursive: true });
          cb(null, root);
        },
        filename: (
          _req: Request,
          file: Express.Multer.File,
          cb: (error: Error | null, filename: string) => void,
        ) => {
          const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          cb(null, `${unique}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Body("altText") altText: string,
    @CurrentUser() user: { id: number },
    @Body("tags") tags?: string,
  ) {
    const tagList = tags ? tags.split(",").map((t) => t.trim()).filter(Boolean) : [];
    if (!file) {
      return { error: "No file uploaded" };
    }
    if (!altText) {
      return { error: "altText is required" };
    }

    const isImage = file.mimetype.startsWith("image/");
    let fileUrl = `/uploads/originals/${file.filename}`;
    let type = file.mimetype;

    if (isImage) {
      const optimizedDir = join(process.cwd(), "apps", "admin-api", "uploads", "optimized");
      if (!existsSync(optimizedDir)) mkdirSync(optimizedDir, { recursive: true });
      const webpName = file.filename.replace(extname(file.filename), ".webp");
      const outPath = join(optimizedDir, webpName);
      await sharp(file.path).webp({ quality: 82 }).toFile(outPath);
      fileUrl = `/uploads/optimized/${webpName}`;
      type = "image/webp";
    }

    return this.mediaService.create(
      { fileUrl, type, altText, tags: tagList },
      user?.id,
    );
  }

  @Patch(":id")
  @Roles(UserRole.SUPER_ADMIN, UserRole.CONTENT_MANAGER)
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateMediaDto,
    @CurrentUser() user: { id: number },
  ) {
    return this.mediaService.update(id, dto, user?.id);
  }

  @Delete(":id")
  @Roles(UserRole.SUPER_ADMIN, UserRole.CONTENT_MANAGER)
  remove(@Param("id", ParseIntPipe) id: number, @CurrentUser() user: { id: number }) {
    return this.mediaService.remove(id, user?.id);
  }
}
