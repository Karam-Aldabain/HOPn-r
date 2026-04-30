import { IsArray, IsBoolean, IsOptional, IsString } from "class-validator";

export class CreateSolutionDto {
  @IsString()
  title!: string;

  @IsString()
  description!: string;

  @IsString()
  @IsOptional()
  caseSnippet?: string;

  @IsArray()
  @IsOptional()
  bulletsProblems?: string[];

  @IsArray()
  @IsOptional()
  bulletsDeliverables?: string[];

  @IsString()
  @IsOptional()
  icon?: string;

  @IsString()
  @IsOptional()
  ctaLabel?: string;

  @IsString()
  @IsOptional()
  ctaUrl?: string;

  @IsBoolean()
  @IsOptional()
  visible?: boolean;

  @IsOptional()
  order?: number;
}
