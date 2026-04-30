import { IsArray, IsOptional, IsString } from "class-validator";

export class UpdateMediaDto {
  @IsString()
  @IsOptional()
  fileUrl?: string;

  @IsString()
  @IsOptional()
  type?: string;

  @IsString()
  @IsOptional()
  altText?: string;

  @IsArray()
  @IsOptional()
  tags?: string[];
}
