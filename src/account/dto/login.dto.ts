import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { ValidationKeys } from '../../common/constants/validation-messages';

export class LoginDto {
  /** Registered email address. */
  @ApiProperty({ example: 'john@example.com', format: 'email' })
  @IsEmail({}, { message: i18nValidationMessage(ValidationKeys.EMAIL_INVALID) })
  @IsNotEmpty({ message: i18nValidationMessage(ValidationKeys.REQUIRED) })
  email: string;

  /** Account password. */
  @ApiProperty({ example: 'P@ssw0rd', format: 'password' })
  @IsString({ message: i18nValidationMessage(ValidationKeys.INVALID_TYPE) })
  @IsNotEmpty({ message: i18nValidationMessage(ValidationKeys.REQUIRED) })
  password: string;
}
