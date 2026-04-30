import { IsArray, IsBoolean, IsOptional, IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

class NavItemInput {
  @IsOptional()
  id?: number;

  @IsString()
  label!: string;

  @IsString()
  url!: string;

  @IsOptional()
  order?: number;

  @IsOptional()
  @IsBoolean()
  visible?: boolean;

  @IsOptional()
  @IsBoolean()
  isCta?: boolean;

  @IsOptional()
  @IsBoolean()
  external?: boolean;
}

export class UpdateNavigationDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => NavItemInput)
  items!: NavItemInput[];
}
