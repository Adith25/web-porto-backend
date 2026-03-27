import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateMessageDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  subject: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(10)
  message: string;
}
