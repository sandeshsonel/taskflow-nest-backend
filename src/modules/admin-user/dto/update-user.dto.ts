import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'John' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.INVALID_TYPE') })
  firstName?: string;

  @ApiPropertyOptional({ example: 'Doe' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.INVALID_TYPE') })
  lastName?: string;

  @ApiPropertyOptional({ example: 'john.doe@example.com' })
  @IsOptional()
  @IsEmail(
    {},
    { message: i18nValidationMessage('validation.VALID_EMAIL_ALLOWED') },
  )
  email?: string;

  @ApiPropertyOptional({
    example: 'editor',
    enum: ['admin', 'editor', 'viewer'],
  })
  @IsOptional()
  @IsEnum(['admin', 'editor', 'viewer'], {
    message: i18nValidationMessage('validation.ROLE_INVALID_VALIDATION'),
  })
  role?: string;

  @ApiPropertyOptional({ example: 'newpassword123' })
  @IsOptional()
  @MinLength(6, {
    message: i18nValidationMessage('validation.PASSWORD_MIN_VALIDATION'),
  })
  password?: string;
}
