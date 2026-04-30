import { IsBoolean, IsInt, IsObject, IsOptional, IsString } from "class-validator";
import { Prisma } from "@prisma/client";

export class UpdateSectionDto {
  @IsInt()
  @IsOptional()
  pageId?: number;

  @IsString()
  @IsOptional()
  type?: string;

  @IsObject()
  @IsOptional()
  contentJson?: Prisma.InputJsonValue;

  @IsBoolean()
  @IsOptional()
  visible?: boolean;

  @IsInt()
  @IsOptional()
  order?: number;
}
