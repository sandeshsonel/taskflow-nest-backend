import { IsEmail, IsIn, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { Match } from '../../common/decorators/match.decorator';

export class CreateAccountDto {
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  name: string;

  @IsEmail(
    {},
    {
      message: 'VALID_EMAIL_ALLOWED',
    },
  )
  @MinLength(6, {
    message: 'EMAIL_MIN_VALIDATION',
  })
  @MaxLength(50, {
    message: 'EMAIL_MAX_VALIDATION',
  })
  email: string;

  @IsOptional()
  @IsIn(['user', 'admin'])
  role?: 'user' | 'admin';

  @IsString()
  @MinLength(7)
  password: string;

  @IsString()
  @Match('password', {
    message: 'PASSWORD_MISMATCH',
  })
  confirmPassword: string;
}