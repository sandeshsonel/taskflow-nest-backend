import { IsEmail, IsIn, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { Match } from '../../common/decorators/match.decorator';
import { ValidationKeys } from '../../common/constants/validation-messages';

export class CreateAccountDto {
  @IsString({ message: i18nValidationMessage(ValidationKeys.INVALID_TYPE) })
  @MinLength(3, { message: i18nValidationMessage(ValidationKeys.NAME_MIN) })
  @MaxLength(50, { message: i18nValidationMessage(ValidationKeys.NAME_MAX) })
  name: string;

  @IsEmail({}, { message: i18nValidationMessage(ValidationKeys.EMAIL_INVALID) })
  @MinLength(6, { message: i18nValidationMessage(ValidationKeys.EMAIL_MIN) })
  @MaxLength(50, { message: i18nValidationMessage(ValidationKeys.EMAIL_MAX) })
  email: string;

  @IsOptional()
  @IsIn(['user', 'admin'], { message: i18nValidationMessage(ValidationKeys.ROLE_INVALID) })
  role?: 'user' | 'admin';

  @IsString({ message: i18nValidationMessage(ValidationKeys.INVALID_TYPE) })
  @MinLength(7, { message: i18nValidationMessage(ValidationKeys.PASSWORD_MIN) })
  password: string;

  @IsString({ message: i18nValidationMessage(ValidationKeys.INVALID_TYPE) })
  @Match('password', { message: i18nValidationMessage(ValidationKeys.PASSWORD_MISMATCH) })
  confirmPassword: string;
}