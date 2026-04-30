import { IsBoolean, IsEmail, IsOptional, IsString } from "class-validator";

export class CreateLeadDto {
  @IsString()
  name!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @IsOptional()
  company?: string;

  @IsString()
  topic!: string;

  @IsString()
  message!: string;

  @IsBoolean()
  consent!: boolean;

  @IsString()
  @IsOptional()
  captchaToken?: string;
}
