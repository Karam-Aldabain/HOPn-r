import { IsArray, IsOptional, IsString } from "class-validator";

export class CreateMediaDto {
  @IsString()
  fileUrl!: string;

  @IsString()
  type!: string;

  @IsString()
  altText!: string;

  @IsArray()
  @IsOptional()
  tags?: string[];
}
