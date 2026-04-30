import { IsBoolean, IsOptional, IsString } from "class-validator";

export class UpdatePartnerDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  logo?: string;

  @IsString()
  @IsOptional()
  url?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  partnershipType?: string;

  @IsBoolean()
  @IsOptional()
  visible?: boolean;

  @IsOptional()
  order?: number;
}
