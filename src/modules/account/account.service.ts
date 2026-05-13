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
import { I18nService } from 'nestjs-i18n';

import { User, UserDocument } from './schemas/user.schema';
import { CreateAccountDto } from './dto/create-account.dto';
import { LoginDto } from './dto/login.dto';
import { GoogleAuthDto } from './dto/google-auth.dto';
import {
  AccountKeys,
  CommonKeys,
} from '../../common/constants/validation-messages';
import admin from '../../utils/firebase';
import { WinstonLoggerService } from '../logger/logger.service';

@Injectable()
export class AccountService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
    private readonly i18n: I18nService,
    private readonly logger: WinstonLoggerService,
  ) { }

  async signup(createAccountDto: CreateAccountDto) {
    const { name, email, password, role } = createAccountDto;

    try {
      const existingUser = await this.userModel.findOne({ email });

      if (existingUser) {
        if (existingUser.adminId) {
          throw new BadRequestException(
            this.i18n.t(AccountKeys.EMAIL_REGISTERED_CONTACT_ADMIN),
          );
        }
        throw new BadRequestException(
          this.i18n.t(AccountKeys.EMAIL_ALREADY_REGISTERED),
        );
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await this.userModel.create({
        fullName: name,
        email,
        password: hashedPassword,
        role: role || 'user',
      });

      const token = await this.jwtService.signAsync({
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        firebaseUID: user.firebaseUID ?? null,
        role: user.role,
      });

      return {
        message: this.i18n.t(AccountKeys.SIGNUP_SUCCESS),
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

      throw new InternalServerErrorException(
        this.i18n.t(CommonKeys.SERVER_ERROR),
      );
    }
  }

  async signupWithGoogle(googleAuthDto: GoogleAuthDto) {
    const { idToken, role } = googleAuthDto;
    try {
      if (!idToken) {
        throw new BadRequestException(this.i18n.t(CommonKeys.TOKEN_MISSING));
      }

      const decodedToken = await admin.auth().verifyIdToken(idToken);
      const { uid, email, name, picture } = decodedToken;

      const userAlreadyExists = await this.userModel.findOne({ email });
      if (userAlreadyExists) {
        if (userAlreadyExists.adminId) {
          throw new BadRequestException(
            this.i18n.t(AccountKeys.EMAIL_REGISTERED_CONTACT_ADMIN),
          );
        }
        throw new BadRequestException(
          this.i18n.t(AccountKeys.USER_ALREADY_EXISTS),
        );
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
        message: this.i18n.t(AccountKeys.SIGNUP_SUCCESS),
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
      if (error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error('Error creating user:', error);
      throw new InternalServerErrorException(
        this.i18n.t(CommonKeys.SERVER_ERROR),
      );
    }
  }

  async signin(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const account = await this.userModel.findOne({ email });
    if (!account || !account.password) {
      throw new BadRequestException(
        this.i18n.t(AccountKeys.INVALID_CREDENTIALS),
      );
    }

    if (account.status === 'suspended') {
      throw new BadRequestException(this.i18n.t(AccountKeys.ACCOUNT_SUSPENDED));
    }

    const isMatch = await bcrypt.compare(password, account.password);
    if (!isMatch) {
      throw new BadRequestException(
        this.i18n.t(AccountKeys.INCORRECT_PASSWORD),
      );
    }

    const token = await this.jwtService.signAsync({
      id: account._id,
      fullName: account.fullName,
      email: account.email,
      firebaseUID: account.firebaseUID ?? null,
      role: account.role,
    });

    return {
      message: this.i18n.t(AccountKeys.SIGNIN_SUCCESS),
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
      if (!idToken) {
        throw new BadRequestException(this.i18n.t(CommonKeys.TOKEN_MISSING));
      }

      const decodedToken = await admin.auth().verifyIdToken(idToken);

      const user = await this.userModel.findOne({ email: decodedToken.email });

      if (!user) {
        throw new BadRequestException(this.i18n.t(AccountKeys.USER_NOT_FOUND));
      }

      const token = await this.jwtService.signAsync({
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        firebaseUID: user.firebaseUID ?? null,
        role: user.role,
      });

      return {
        message: this.i18n.t(AccountKeys.SIGNIN_SUCCESS),
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
      this.logger.error('Signin error:', error);
      throw new InternalServerErrorException(
        this.i18n.t(CommonKeys.SERVER_ERROR),
      );
    }
  }

  async getProfileDetails(email: string) {
    const account = await this.userModel.findOne({ email });
    if (!account) {
      throw new NotFoundException(
        this.i18n.t(AccountKeys.USER_DETAILS_NOT_FOUND),
      );
    }

    if (account.status === 'suspended') {
      throw new UnauthorizedException({
        success: false,
        data: { status: 'suspended' },
        message: this.i18n.t(AccountKeys.ACCOUNT_SUSPENDED),
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
      message: this.i18n.t(AccountKeys.USER_DETAILS_FETCHED),
    };
  }
}
