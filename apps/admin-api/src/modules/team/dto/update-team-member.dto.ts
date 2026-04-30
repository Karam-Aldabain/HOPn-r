import { IsBoolean, IsOptional, IsString } from "class-validator";

export class UpdateTeamMemberDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  role?: string;

  @IsString()
  @IsOptional()
  photo?: string;

  @IsString()
  @IsOptional()
  bio?: string;

  @IsString()
  @IsOptional()
  linkedinUrl?: string;

  @IsBoolean()
  @IsOptional()
  visible?: boolean;

  @IsOptional()
  order?: number;
}
