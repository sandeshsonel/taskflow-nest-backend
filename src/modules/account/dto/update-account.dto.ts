import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { ValidationKeys } from '../../../common/constants/validation-messages';

export class UpdateAccountDto {
  /** New email address (optional). */
  @ApiPropertyOptional({ example: 'new-email@example.com', format: 'email' })
  @IsEmail({}, { message: i18nValidationMessage(ValidationKeys.EMAIL_INVALID) })
  @IsOptional()
  email?: string;

  /** Updated first name (optional). */
  @ApiPropertyOptional({ example: 'Jane' })
  @IsString({ message: i18nValidationMessage(ValidationKeys.INVALID_TYPE) })
  @IsOptional()
  firstName?: string;

  /** Updated last name (optional). */
  @ApiPropertyOptional({ example: 'Doe' })
  @IsString({ message: i18nValidationMessage(ValidationKeys.INVALID_TYPE) })
  @IsOptional()
  lastName?: string;
}
