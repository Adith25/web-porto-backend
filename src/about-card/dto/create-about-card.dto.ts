import { IsString, IsOptional } from 'class-validator';

export class CreateAboutCardDto {
  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsOptional()
  @IsString()
  icon?: string;

  @IsOptional()
  @IsString()
  textColor?: string;
}
