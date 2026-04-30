import { IsBoolean, IsInt, IsObject, IsOptional, IsString } from "class-validator";
import { Prisma } from "@prisma/client";

export class CreateSectionDto {
  @IsInt()
  @IsOptional()
  pageId?: number;

  @IsString()
  type!: string;

  @IsObject()
  contentJson!: Prisma.InputJsonValue;

  @IsBoolean()
  @IsOptional()
  visible?: boolean;

  @IsInt()
  @IsOptional()
  order?: number;
}
