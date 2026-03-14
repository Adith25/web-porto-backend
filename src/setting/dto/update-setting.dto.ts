import { IsString, IsBoolean, IsOptional, IsInt } from 'class-validator';

export class UpdateSettingDto {
  @IsOptional()
  @IsString()
  announcementText?: string;

  @IsOptional()
  @IsBoolean()
  announcementActive?: boolean;

  @IsOptional()
  @IsString()
  bannerColor?: string;

  @IsOptional()
  @IsString()
  textColor?: string;

  @IsOptional()
  @IsInt()
  animationSpeed?: number;

  @IsOptional()
  @IsString()
  cvUrl?: string;
}
