import { IsString, MinLength } from "class-validator";

export class CreateLeadNoteDto {
  @IsString()
  @MinLength(1)
  body!: string;
}
