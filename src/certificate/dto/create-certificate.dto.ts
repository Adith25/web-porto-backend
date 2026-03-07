import { IsBooleanString, IsOptional, IsString } from 'class-validator';

export class CreateCertificateDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  credentialUrl?: string;

  @IsOptional()
  @IsBooleanString()
  isPdf?: string; // Diterima sebagai string dari form-data
}
