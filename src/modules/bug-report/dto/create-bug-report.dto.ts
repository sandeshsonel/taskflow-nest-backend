import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBugReportDto {
  @ApiPropertyOptional({
    description: 'The full name of the person reporting the bug',
    example: 'John Doe',
  })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.INVALID_TYPE') })
  @Matches(/^[a-zA-Z\s]+$/, {
    message: i18nValidationMessage('validation.INVALID_TYPE'),
  })
  fullName?: string;

  @ApiPropertyOptional({
    description: 'The email address of the person reporting the bug',
    example: 'john.doe@example.com',
  })
  @IsOptional()
  @IsEmail({}, { message: i18nValidationMessage('validation.VALID_EMAIL_ALLOWED') })
  email?: string;

  @ApiProperty({
    description: 'A brief, descriptive title for the bug',
    example: 'Application crashes on login',
    minLength: 3,
  })
  @IsNotEmpty({ message: i18nValidationMessage('validation.REQUIRED') })
  @IsString({ message: i18nValidationMessage('validation.INVALID_TYPE') })
  @MinLength(3, { message: i18nValidationMessage('validation.STRING_MIN_VALIDATION') })
  title: string;

  @ApiProperty({
    description: 'A detailed description of the bug and steps to reproduce',
    example: 'When I click the login button with valid credentials, the app closes unexpectedly.',
    minLength: 10,
  })
  @IsNotEmpty({ message: i18nValidationMessage('validation.REQUIRED') })
  @IsString({ message: i18nValidationMessage('validation.INVALID_TYPE') })
  @MinLength(10, { message: i18nValidationMessage('validation.STRING_MIN_VALIDATION') })
  description: string;
}
