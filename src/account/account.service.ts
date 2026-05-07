import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';

import { User, UserDocument } from './schemas/user.schema';
import { AdminUser, AdminUserDocument } from './schemas/admin-user.schema';
import { CreateAccountDto } from './dto/create-account.dto';
import { LoginDto } from './dto/login.dto';
import { GoogleAuthDto } from './dto/google-auth.dto';
import admin from '../utils/firebase';

@Injectable()
export class AccountService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(AdminUser.name) private adminUserModel: Model<AdminUserDocument>,
    private jwtService: JwtService,
  ) { }

  async signup(createAccountDto: CreateAccountDto) {
    const { name, email, password, role } = createAccountDto;

    try {
      // ✅ Check existing user
      const existingUser = await this.userModel.findOne({ email });

      if (existingUser) {
        throw new BadRequestException('Email already registered');
      }

      const isUser = role === 'user';

      // ✅ Check admin users collection
      if (isUser) {
        const isAdminUser = await this.adminUserModel.findOne({
          'users.email': email,
        });

        if (isAdminUser) {
          throw new BadRequestException(
            'Email already registered, Please contact admin',
          );
        }
      }

      // ✅ Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // ✅ Create user
      const user = await this.userModel.create({
        fullName: name,
        email,
        password: hashedPassword,
        role: role || 'user',
      });

      // ✅ Generate JWT token
      const token = await this.jwtService.signAsync({
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        firebaseUID: user.firebaseUID ?? null,
        role: user.role,
      });

      return {
        message: 'Signup successful',
        token,
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
          status: user.status,
          createdAt: user.createdAt,
        },
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new InternalServerErrorException('Server error');
    }
  }

  async signupWithGoogle(googleAuthDto: GoogleAuthDto) {
    const { idToken, role } = googleAuthDto;
    try {
      if (!idToken) throw new BadRequestException('Token missing');

      const decodedToken = await admin.auth().verifyIdToken(idToken);
      const { uid, email, name, picture } = decodedToken;

      const userAlreadyExists = await this.userModel.findOne({ email });
      if (userAlreadyExists) throw new BadRequestException('User already exists');

      const isUser = role === 'user';

      if (isUser) {
        const isAdminUser = await this.adminUserModel.findOne({ 'users.email': email });
        if (isAdminUser) {
          throw new BadRequestException('Email already registered, Please contact the admin');
        }
      }

      const newUser = await this.userModel.create({
        firebaseUID: uid,
        fullName: name,
        email,
        photoURL: picture,
        role: role || 'user',
      });

      const token = await this.jwtService.signAsync({
        id: newUser._id,
        fullName: newUser.fullName,
        email: email,
        firebaseUID: uid,
        role: newUser.role,
      });

      return {
        message: 'Signup success',
        token,
        user: {
          id: newUser._id,
          firebaseUID: uid,
          fullName: newUser.fullName,
          email: newUser.email,
          role: newUser.role,
          status: newUser.status,
          createdAt: newUser.createdAt,
        },
      };
    } catch (error: any) {
      console.error('Error creating user:', error);
      throw new InternalServerErrorException('Server error');
    }
  }

  async signin(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const account = await this.userModel.findOne({ email });
    if (!account || !account.password) {
      throw new BadRequestException('Invalid credentials');
    }

    if (account.status === 'suspended') {
      throw new BadRequestException('Your account is suspended. Please contact the administrator for assistance.');
    }

    const isMatch = await bcrypt.compare(password, account.password);
    if (!isMatch) {
      throw new BadRequestException('Incorrect password');
    }

    const token = await this.jwtService.signAsync({
      id: account._id,
      fullName: account.fullName,
      email: account.email,
      firebaseUID: account.firebaseUID ?? null,
      role: account.role,
    });

    return {
      message: 'Signin successful',
      token,
      user: {
        id: account._id,
        fullName: account.fullName,
        email: account.email,
        role: account.role,
        status: account.status,
        createdAt: account.createdAt,
      },
    };
  }

  async signinWithGoogle(googleAuthDto: GoogleAuthDto) {
    const { idToken } = googleAuthDto;

    try {
      if (!idToken) throw new BadRequestException('Token missing');

      const decodedToken = await admin.auth().verifyIdToken(idToken);

      const user = await this.userModel.findOne({ email: decodedToken.email });

      if (!user) throw new BadRequestException('User not found');

      const token = await this.jwtService.signAsync(
        {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          firebaseUID: user.firebaseUID ?? null,
          role: user.role,
        });

      return {
        message: 'Signin success',
        token,
        user,
      };
    } catch (error) {
      console.error('Signin error:', error);
      throw new InternalServerErrorException('Server error');
    }
  }

  async getProfileDetails(email: string) {
    const account = await this.userModel.findOne({ email });
    if (!account) {
      throw new NotFoundException('User details not found');
    }

    if (account.status === 'suspended') {
      throw new UnauthorizedException({
        success: false,
        data: { status: 'suspended' },
        message: 'Your account is suspended. Please contact the administrator for assistance.',
      });
    }

    return {
      success: true,
      data: {
        id: account._id,
        fullName: account.fullName,
        email: account.email,
        role: account.role,
        status: account.status,
        createdAt: account.createdAt,
      },
      message: 'User details fetched successfully',
    };
  }
}
