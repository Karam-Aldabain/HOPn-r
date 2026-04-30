import { IsArray, IsInt } from "class-validator";

export class ReorderSectionsDto {
  @IsInt()
  pageId!: number;

  @IsArray()
  sectionIds!: number[];
}
