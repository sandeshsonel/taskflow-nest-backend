import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { ValidationKeys } from '../../common/constants/validation-messages';

export class LoginDto {
  @IsEmail({}, { message: i18nValidationMessage(ValidationKeys.EMAIL_INVALID) })
  @IsNotEmpty({ message: i18nValidationMessage(ValidationKeys.REQUIRED) })
  email: string;

  @IsString({ message: i18nValidationMessage(ValidationKeys.INVALID_TYPE) })
  @IsNotEmpty({ message: i18nValidationMessage(ValidationKeys.REQUIRED) })
  password: string;
}
