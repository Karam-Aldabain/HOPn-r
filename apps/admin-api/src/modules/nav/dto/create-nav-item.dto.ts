import { IsBoolean, IsOptional, IsString } from "class-validator";

export class CreateNavItemDto {
  @IsString()
  label!: string;

  @IsString()
  url!: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsBoolean()
  isCta?: boolean;

  @IsOptional()
  @IsBoolean()
  external?: boolean;

  @IsOptional()
  order?: number;

  @IsBoolean()
  @IsOptional()
  visible?: boolean;
}
