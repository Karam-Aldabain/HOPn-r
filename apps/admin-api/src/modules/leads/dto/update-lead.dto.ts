import { IsEnum, IsOptional, IsString } from "class-validator";
import { LeadStatus } from "@prisma/client";

export class UpdateLeadDto {
  @IsEnum(LeadStatus)
  @IsOptional()
  status?: LeadStatus;

  @IsString()
  @IsOptional()
  notes?: string;
}
