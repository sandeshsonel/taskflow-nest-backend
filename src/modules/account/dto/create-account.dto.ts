import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsIn,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { Match } from '../../../common/decorators/match.decorator';
import { ValidationKeys } from '../../../common/constants/validation-messages';

export class CreateAccountDto {
  /** Full name of the user (3–50 characters). */
  @ApiProperty({ example: 'John Doe', minLength: 3, maxLength: 50 })
  @IsString({ message: i18nValidationMessage(ValidationKeys.INVALID_TYPE) })
  @MinLength(3, { message: i18nValidationMessage(ValidationKeys.NAME_MIN) })
  @MaxLength(50, { message: i18nValidationMessage(ValidationKeys.NAME_MAX) })
  name: string;

  /** Account email address. */
  @ApiProperty({ example: 'john@example.com', format: 'email' })
  @IsEmail({}, { message: i18nValidationMessage(ValidationKeys.EMAIL_INVALID) })
  @MinLength(6, { message: i18nValidationMessage(ValidationKeys.EMAIL_MIN) })
  @MaxLength(50, { message: i18nValidationMessage(ValidationKeys.EMAIL_MAX) })
  email: string;

  /** Account role — defaults to "user" when omitted. */
  @ApiPropertyOptional({ enum: ['user', 'admin'], default: 'user' })
  @IsOptional()
  @IsIn(['user', 'admin'], {
    message: i18nValidationMessage(ValidationKeys.ROLE_INVALID),
  })
  role?: 'user' | 'admin';

  /** Password (min 7 characters). */
  @ApiProperty({ example: 'P@ssw0rd', minLength: 7, format: 'password' })
  @IsString({ message: i18nValidationMessage(ValidationKeys.INVALID_TYPE) })
  @MinLength(7, { message: i18nValidationMessage(ValidationKeys.PASSWORD_MIN) })
  password: string;

  /** Must match the password field exactly. */
  @ApiProperty({ example: 'P@ssw0rd', format: 'password' })
  @IsString({ message: i18nValidationMessage(ValidationKeys.INVALID_TYPE) })
  @Match('password', {
    message: i18nValidationMessage(ValidationKeys.PASSWORD_MISMATCH),
  })
  confirmPassword: string;
}
