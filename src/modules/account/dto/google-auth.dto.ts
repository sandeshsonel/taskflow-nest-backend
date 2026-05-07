import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { ValidationKeys } from '../../../common/constants/validation-messages';

export class GoogleAuthDto {
  /** Firebase ID token obtained from the Google sign-in client SDK. */
  @ApiProperty({
    example: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'Firebase ID token from the client-side Google sign-in',
  })
  @IsString({ message: i18nValidationMessage(ValidationKeys.INVALID_TYPE) })
  @IsNotEmpty({
    message: i18nValidationMessage(ValidationKeys.ID_TOKEN_REQUIRED),
  })
  idToken: string;

  /** Optional role assignment (defaults to "user"). */
  @ApiPropertyOptional({ example: 'user', enum: ['user', 'admin'] })
  @IsString({ message: i18nValidationMessage(ValidationKeys.INVALID_TYPE) })
  @IsOptional()
  role?: string;
}
