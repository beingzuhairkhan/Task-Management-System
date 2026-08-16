import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class GenerateDescriptionDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  title: string;
}