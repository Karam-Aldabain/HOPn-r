import { IsArray, IsBoolean, IsOptional, IsString } from "class-validator";

export class UpdateProjectDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  shortDesc?: string;

  @IsString()
  @IsOptional()
  longDesc?: string;

  @IsString()
  @IsOptional()
  industry?: string;

  @IsArray()
  @IsOptional()
  techTags?: string[];

  @IsString()
  @IsOptional()
  coverImage?: string;

  @IsArray()
  @IsOptional()
  gallery?: string[];

  @IsArray()
  @IsOptional()
  highlights?: string[];

  @IsString()
  @IsOptional()
  externalUrl?: string;

  @IsBoolean()
  @IsOptional()
  featured?: boolean;

  @IsBoolean()
  @IsOptional()
  published?: boolean;

  @IsOptional()
  order?: number;
}
