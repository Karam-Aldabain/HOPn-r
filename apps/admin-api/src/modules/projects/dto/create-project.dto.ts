import { IsArray, IsBoolean, IsOptional, IsString } from "class-validator";

export class CreateProjectDto {
  @IsString()
  title!: string;

  @IsString()
  shortDesc!: string;

  @IsString()
  @IsOptional()
  longDesc?: string;

  @IsString()
  industry!: string;

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
