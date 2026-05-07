import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class CreateUserDto {
  @ApiProperty({ example: 'John' })
  @IsNotEmpty({ message: i18nValidationMessage('validation.REQUIRED') })
  @IsString({ message: i18nValidationMessage('validation.INVALID_TYPE') })
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsNotEmpty({ message: i18nValidationMessage('validation.REQUIRED') })
  @IsString({ message: i18nValidationMessage('validation.INVALID_TYPE') })
  lastName: string;

  @ApiProperty({ example: 'john.doe@example.com' })
  @IsNotEmpty({ message: i18nValidationMessage('validation.REQUIRED') })
  @IsEmail(
    {},
    { message: i18nValidationMessage('validation.VALID_EMAIL_ALLOWED') },
  )
  email: string;

  @ApiProperty({ example: 'editor', enum: ['admin', 'editor', 'viewer'] })
  @IsNotEmpty({ message: i18nValidationMessage('validation.REQUIRED') })
  @IsEnum(['admin', 'editor', 'viewer'], {
    message: i18nValidationMessage('validation.ROLE_INVALID_VALIDATION'),
  })
  role: string;

  @ApiProperty({ example: 'password123' })
  @IsNotEmpty({ message: i18nValidationMessage('validation.REQUIRED') })
  @MinLength(6, {
    message: i18nValidationMessage('validation.PASSWORD_MIN_VALIDATION'),
  })
  password: string;
}
