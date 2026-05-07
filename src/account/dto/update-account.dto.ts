import { IsEmail, IsOptional, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { ValidationKeys } from '../../common/constants/validation-messages';

export class UpdateAccountDto {
  @IsEmail({}, { message: i18nValidationMessage(ValidationKeys.EMAIL_INVALID) })
  @IsOptional()
  email?: string;

  @IsString({ message: i18nValidationMessage(ValidationKeys.INVALID_TYPE) })
  @IsOptional()
  firstName?: string;

  @IsString({ message: i18nValidationMessage(ValidationKeys.INVALID_TYPE) })
  @IsOptional()
  lastName?: string;
}
