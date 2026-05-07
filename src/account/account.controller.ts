import {
  Controller,
  Post,
  Body,
  Get,
  HttpCode,
  HttpStatus,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import { AccountService } from './account.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { LoginDto } from './dto/login.dto';
import { GoogleAuthDto } from './dto/google-auth.dto';
import { Public, CurrentUser } from '../auth';

@Controller('account')
// Accept only DTO-defined fields.
// Reject unexpected payload properties for cleaner and safer APIs.
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
export class AccountController {
  constructor(private readonly accountService: AccountService) { }

  @Public()
  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signup(@Body() createAccountDto: CreateAccountDto) {
    return this.accountService.signup(createAccountDto);
  }

  @Public()
  @Post('signup/google')
  @HttpCode(HttpStatus.CREATED)
  async signupWithGoogle(@Body() googleAuthDto: GoogleAuthDto) {
    return this.accountService.signupWithGoogle(googleAuthDto);
  }

  @Public()
  @Post('signin')
  @HttpCode(HttpStatus.OK)
  async signin(@Body() loginDto: LoginDto) {
    return this.accountService.signin(loginDto);
  }

  @Public()
  @Post('signin/google')
  @HttpCode(HttpStatus.OK)
  async signinWithGoogle(@Body() googleAuthDto: GoogleAuthDto) {
    return this.accountService.signinWithGoogle(googleAuthDto);
  }

  @Get('profile-details')
  async getProfileDetails(@CurrentUser('email') email: string) {
    return this.accountService.getProfileDetails(email);
  }
}
