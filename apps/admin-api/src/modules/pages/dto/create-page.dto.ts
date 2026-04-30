import { IsOptional, IsString } from "class-validator";

export class CreatePageDto {
  @IsString()
  slug!: string;

  @IsString()
  title!: string;

  @IsString()
  @IsOptional()
  seoTitle?: string;

  @IsString()
  @IsOptional()
  seoDescription?: string;

  @IsString()
  @IsOptional()
  ogImage?: string;
}
