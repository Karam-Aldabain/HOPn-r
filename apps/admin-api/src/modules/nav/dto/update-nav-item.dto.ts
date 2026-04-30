import { IsBoolean, IsOptional, IsString } from "class-validator";

export class UpdateNavItemDto {
  @IsString()
  @IsOptional()
  label?: string;

  @IsString()
  @IsOptional()
  url?: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsBoolean()
  @IsOptional()
  isCta?: boolean;

  @IsBoolean()
  @IsOptional()
  external?: boolean;

  @IsOptional()
  order?: number;

  @IsBoolean()
  @IsOptional()
  visible?: boolean;
}
