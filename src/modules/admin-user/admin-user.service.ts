import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { AdminUser, AdminUserDocument } from './schemas/admin-user.schema';
import { User, UserDocument } from '../account/schemas/user.schema';
import {
  Notifications,
  NotificationDocument,
} from '../notification/schemas/notification.schema';
import { Task, TaskDocument } from '../task/schemas/task.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { getLastNDays, percentChange } from '../../utils';
import { I18nService } from 'nestjs-i18n';
import {
  AdminKeys,
  AccountKeys,
} from '../../common/constants/validation-messages';
import { WinstonLoggerService } from '../logger/logger.service';

@Injectable()
export class AdminUserService {
  constructor(
    @InjectModel(AdminUser.name)
    private adminUserModel: Model<AdminUserDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Notifications.name)
    private notificationModel: Model<NotificationDocument>,
    @InjectModel(Task.name) private taskModel: Model<TaskDocument>,
    private readonly i18n: I18nService,
    private readonly logger: WinstonLoggerService,
  ) {}

  async getUsersList(adminId: string) {
    const users = await this.adminUserModel
      .find({ adminId })
      .select('-password -__v');
    return users;
  }

  async createUser(
    adminId: string,
    adminEmail: string,
    adminFullName: string,
    createUserDto: CreateUserDto,
  ) {
    const { firstName, lastName, email, role, password } = createUserDto;

    if (adminEmail === email) {
      throw new BadRequestException(this.i18n.t(AdminKeys.SAME_EMAIL_ERROR));
    }

    const existingUser = await this.userModel.findOne({ email });
    if (existingUser && existingUser.role === 'admin') {
      throw new BadRequestException(
        this.i18n.t(AdminKeys.ADMIN_ALREADY_REGISTERED),
      );
    }

    const isAlreadyInAdminUsers = await this.adminUserModel.findOne({
      email,
    });

    if (isAlreadyInAdminUsers) {
      throw new BadRequestException(
        this.i18n.t(AccountKeys.EMAIL_ALREADY_REGISTERED),
      );
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    try {
      const normalUser = await this.userModel.findOne({ email });

      const newUser = await this.adminUserModel.create({
        adminId,
        firstName,
        lastName,
        email,
        role,
        userId: normalUser ? String(normalUser._id) : null,
        password: hashedPassword,
        active: true,
        status: 'invited',
        joinedAt: null,
        lastLogin: null,
      });

      const notificationData = {
        message: this.i18n.t(AdminKeys.USER_INVITE_NOTIFICATION, {
          args: { adminName: adminFullName },
        }),
        actionType: 'invite',
        actionData: {
          adminId: String(adminId),
          userId: String(newUser?._id),
        },
      };

      await this.notificationModel.findOneAndUpdate(
        { email },
        { $push: { notifications: notificationData } },
        { new: true, upsert: true },
      );

      return { message: this.i18n.t(AdminKeys.USER_CREATED) };
    } catch (error) {
      this.logger.error('Error creating user in AdminUserService:', error);
      throw error;
    }
  }

  async updateUser(
    adminId: string,
    userId: string,
    updateUserDto: UpdateUserDto,
  ) {
    const isUserExists = await this.adminUserModel.findOne({
      adminId,
      _id: userId,
    });

    if (!isUserExists) {
      throw new NotFoundException(this.i18n.t(AdminKeys.USER_NOT_FOUND));
    }

    const updateData: any = { ...updateUserDto };
    if (updateData.password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(updateData.password, salt);
      updateData.password = hashedPassword;
    }

    try {
      await this.adminUserModel.findOneAndUpdate(
        { adminId, _id: userId },
        { $set: updateData },
        { new: true },
      );

      return { message: this.i18n.t(AdminKeys.USER_UPDATED) };
    } catch (error) {
      this.logger.error('Error updating user in AdminUserService:', error);
      throw error;
    }
  }

  async deleteUser(adminId: string, userId: string) {
    if (!userId) {
      throw new BadRequestException(this.i18n.t(AdminKeys.USER_ID_REQUIRED));
    }

    const isUserExists = await this.adminUserModel.findOne({
      adminId,
      _id: userId,
    });

    if (!isUserExists) {
      throw new NotFoundException(this.i18n.t(AdminKeys.USER_NOT_FOUND));
    }

    await this.adminUserModel.findOneAndDelete({ adminId, _id: userId });

    return { message: this.i18n.t(AdminKeys.USER_DELETED) };
  }

  async getDashboardStats(adminId: string) {
    try {
      const last7Days = getLastNDays(7);
      const prev14Days = getLastNDays(14);

      const users = await this.adminUserModel.find({ adminId });
      const normalUserIds = users
        .map((u: any) => u.userId)
        .filter((id) => id != null);

      const totalUsers = users.length;
      const currentNewSignups = users.filter(
        (u: any) => u.joinedAt && u.joinedAt >= last7Days,
      ).length;
      const previousNewSignups = users.filter(
        (u: any) =>
          u.joinedAt && u.joinedAt >= prev14Days && u.joinedAt < last7Days,
      ).length;
      const usersLastWeek = users.filter(
        (u: any) => u.joinedAt && u.joinedAt < last7Days,
      ).length;

      // ACTIVE TASKS NOW
      const activeTasksCount = await this.taskModel.countDocuments({
        assignTo: { $in: normalUserIds },
        status: { $in: ['pending', 'in-progress'] },
      });

      // ACTIVE TASKS LAST WEEK
      const activeTasksPrevCount = await this.taskModel.countDocuments({
        assignTo: { $in: normalUserIds },
        status: { $in: ['pending', 'in-progress'] },
        updatedAt: { $lt: last7Days },
      });

      // COMPLETED THIS WEEK
      const completedThisWeekCount = await this.taskModel.countDocuments({
        assignTo: { $in: normalUserIds },
        status: 'completed',
        updatedAt: { $gte: last7Days },
      });

      // COMPLETED LAST WEEK
      const completedLastWeekCount = await this.taskModel.countDocuments({
        assignTo: { $in: normalUserIds },
        status: 'completed',
        updatedAt: { $gte: prev14Days, $lt: last7Days },
      });

      return {
        totalUsers,
        totalUsersChange: percentChange(totalUsers, usersLastWeek),
        activeTasks: activeTasksCount,
        activeTasksChange: percentChange(
          activeTasksCount,
          activeTasksPrevCount,
        ),
        completedThisWeek: completedThisWeekCount,
        completedThisWeekChange: percentChange(
          completedThisWeekCount,
          completedLastWeekCount,
        ),
        newSignups: currentNewSignups,
        newSignupsChange: percentChange(currentNewSignups, previousNewSignups),
      };
    } catch (error) {
      this.logger.error(
        'Error fetching dashboard stats in AdminUserService:',
        error,
      );
      throw error;
    }
  }
}
