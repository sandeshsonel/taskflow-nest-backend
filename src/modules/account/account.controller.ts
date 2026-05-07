import {
  Controller,
  Post,
  Body,
  Get,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { AccountService } from './account.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { LoginDto } from './dto/login.dto';
import { GoogleAuthDto } from './dto/google-auth.dto';
import { Public, CurrentUser } from '../auth';

@ApiTags('Account')
@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) { }

  @Public()
  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new account', description: 'Creates a new user with email/password credentials and returns a JWT.' })
  @ApiResponse({ status: 201, description: 'Account created successfully.' })
  @ApiResponse({ status: 400, description: 'Validation error or email already registered.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  @ApiBody({ type: CreateAccountDto })
  async signup(@Body() createAccountDto: CreateAccountDto) {
    return this.accountService.signup(createAccountDto);
  }

  @Public()
  @Post('signup/google')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register via Google', description: 'Creates a new user from a Firebase Google ID token and returns a JWT.' })
  @ApiResponse({ status: 201, description: 'Account created successfully via Google.' })
  @ApiResponse({ status: 400, description: 'Invalid token or user already exists.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  @ApiBody({ type: GoogleAuthDto })
  async signupWithGoogle(@Body() googleAuthDto: GoogleAuthDto) {
    return this.accountService.signupWithGoogle(googleAuthDto);
  }

  @Public()
  @Post('signin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Sign in with credentials', description: 'Authenticates via email/password and returns a JWT.' })
  @ApiResponse({ status: 200, description: 'Signed in successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid credentials or account suspended.' })
  @ApiBody({ type: LoginDto })
  async signin(@Body() loginDto: LoginDto) {
    return this.accountService.signin(loginDto);
  }

  @Public()
  @Post('signin/google')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Sign in via Google', description: 'Authenticates via a Firebase Google ID token and returns a JWT.' })
  @ApiResponse({ status: 200, description: 'Signed in successfully via Google.' })
  @ApiResponse({ status: 400, description: 'User not found or invalid token.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  @ApiBody({ type: GoogleAuthDto })
  async signinWithGoogle(@Body() googleAuthDto: GoogleAuthDto) {
    return this.accountService.signinWithGoogle(googleAuthDto);
  }

  @Get('profile-details')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get current user profile', description: 'Returns the authenticated user\'s profile details. Requires a valid JWT.' })
  @ApiResponse({ status: 200, description: 'Profile retrieved successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized — missing or invalid JWT.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async getProfileDetails(@CurrentUser('email') email: string) {
    return this.accountService.getProfileDetails(email);
  }
}
