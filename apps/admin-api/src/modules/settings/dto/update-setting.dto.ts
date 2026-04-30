import { IsObject, IsOptional } from "class-validator";

export class UpdateSettingDto {
  @IsObject()
  @IsOptional()
  valueJson?: Record<string, unknown>;
}
