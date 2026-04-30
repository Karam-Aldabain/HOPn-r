import { IsObject, IsString } from "class-validator";

export class CreateSettingDto {
  @IsString()
  key!: string;

  @IsObject()
  valueJson!: Record<string, unknown>;
}
