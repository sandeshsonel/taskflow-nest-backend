import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { AdminUserService } from './admin-user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CurrentUser } from '../auth';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { InternalThrottle } from '../../common/throttler/throttler.decorators';

@ApiTags('Admin User')
@InternalThrottle()
@Controller('admin-user')
@ApiBearerAuth('JWT-auth')
export class AdminUserController {
  constructor(private readonly adminUserService: AdminUserService) {}

  @Get()
  @ApiOperation({ summary: 'Get list of users for the admin' })
  @ApiResponse({ status: 200, description: 'List of users' })
  async getUsersList(@CurrentUser() user: JwtPayload) {
    return this.adminUserService.getUsersList(user.id);
  }

  @Post('create')
  @ApiOperation({ summary: 'Create a new user under the admin' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  async createUser(
    @CurrentUser() user: JwtPayload,
    @Body() createUserDto: CreateUserDto,
  ) {
    return this.adminUserService.createUser(
      user.id,
      user.email,
      user.fullName,
      createUserDto,
    );
  }

  @Patch('update')
  @ApiOperation({ summary: 'Update an existing user' })
  @ApiQuery({ name: 'userId', required: true })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  async updateUser(
    @CurrentUser() user: JwtPayload,
    @Query('userId') userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.adminUserService.updateUser(user.id, userId, updateUserDto);
  }

  @Delete('delete')
  @ApiOperation({ summary: 'Delete a user' })
  @ApiQuery({ name: 'userId', required: true })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  async deleteUser(
    @CurrentUser() user: JwtPayload,
    @Query('userId') userId: string,
  ) {
    return this.adminUserService.deleteUser(user.id, userId);
  }

  @Get('dashboard-stats')
  @ApiOperation({ summary: 'Get dashboard statistics for the admin' })
  @ApiResponse({ status: 200, description: 'Dashboard statistics' })
  async getDashboardStats(@CurrentUser() user: JwtPayload) {
    return this.adminUserService.getDashboardStats(user.id);
  }
}
