import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { ValidationKeys } from '../../common/constants/validation-messages';

export class GoogleAuthDto {
  @IsString({ message: i18nValidationMessage(ValidationKeys.INVALID_TYPE) })
  @IsNotEmpty({ message: i18nValidationMessage(ValidationKeys.ID_TOKEN_REQUIRED) })
  idToken: string;

  @IsString({ message: i18nValidationMessage(ValidationKeys.INVALID_TYPE) })
  @IsOptional()
  role?: string;
}
