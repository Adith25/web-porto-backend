import { IsString, IsOptional } from 'class-validator';

export class CreateSkillDto {
  @IsString()
  category: string;

  @IsOptional()
  @IsString()
  icon?: string;

  @IsOptional()
  @IsString()
  items?: string;
}
