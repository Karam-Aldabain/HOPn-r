import { IsInt, IsOptional, IsString, Min } from "class-validator";

export class UpdatePartnerSettingsDto {
  @IsOptional()
  @IsString()
  displayMode?: string;

  @IsOptional()
  @IsInt()
  @Min(5)
  carouselSpeed?: number;
}
