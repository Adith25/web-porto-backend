import { IsString, IsOptional } from 'class-validator';

export class CreateExperienceDto {
  @IsString()
  role: string;

  @IsString()
  company: string;

  @IsOptional()
  @IsString()
  position?: string;

  @IsString()
  period: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  logo?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
