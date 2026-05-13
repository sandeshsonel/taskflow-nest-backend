import {
  Injectable,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { I18nService } from 'nestjs-i18n';

import { Task, TaskDocument } from './schemas/task.schema';
import { User, UserDocument } from '@modules/account/schemas/user.schema';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtPayload } from '@modules/auth/interfaces/jwt-payload.interface';
import { TaskKeys } from '@common/constants/validation-messages';
import { WinstonLoggerService } from '../logger/logger.service';

@Injectable()
export class TaskService {
  constructor(
    @InjectModel(Task.name) private taskModel: Model<TaskDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly i18n: I18nService,
    private readonly logger: WinstonLoggerService,
  ) {}

  async getTaskById(taskId: string, userId: string) {
    const task = await this.taskModel.findOne({
      _id: new Types.ObjectId(taskId),
      userId: new Types.ObjectId(userId),
    });

    if (!task) {
      throw new NotFoundException(
        this.i18n.t(TaskKeys.NOT_FOUND, {
          args: { id: taskId },
        }),
      );
    }

    return task;
  }

  async getTaskList(
    user: JwtPayload,
    page: number = 1,
    limit: number = 10,
    isAdmin: boolean = false,
  ) {
    const skip = (page - 1) * limit;
    const userId = user.id;

    let query: any = {};

    if (isAdmin) {
      query = { userId: new Types.ObjectId(userId) };
    } else {
      query = { assignTo: new Types.ObjectId(userId) };
    }

    const tasks = await this.taskModel
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Look up assignBy if needed (using user's fullName)
    if (!isAdmin) {
      const userIds = tasks.map((t) => t.userId);
      const assignByUsers = await this.userModel.find({ _id: { $in: userIds as any[] } }, { fullName: 1 }).lean();
      const userMap = new Map(assignByUsers.map((u: any) => [u._id.toString(), u]));

      for (const t of tasks) {
        (t as any).assignBy = userMap.get(t.userId.toString()) || null;
      }
    }

    const total = await this.taskModel.countDocuments(query);

    return {
      data: tasks,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasMore: skip + limit < total,
    };
  }

  async createTask(
    user: JwtPayload,
    createTaskDto: CreateTaskDto,
    isAdminUser: boolean = false,
  ) {
    let createUserId = user.id;

    if (isAdminUser) {
      const adminTask = await this.taskModel.findOne(
        { assignTo: new Types.ObjectId(createUserId) },
        { userId: 1, _id: 0 },
      );
      if (adminTask) {
        createUserId = (adminTask.userId as any).toString();
      } else {
        throw new BadRequestException(this.i18n.t(TaskKeys.ADMIN_NOT_FOUND));
      }
    }

    try {
      const taskData = {
        ...createTaskDto,
        userId: new Types.ObjectId(createUserId),
        assignTo: createTaskDto.assignTo
          ? new Types.ObjectId(createTaskDto.assignTo)
          : new Types.ObjectId(user.id),
      };

      await this.taskModel.create(taskData);

      return {
        success: true,
        message: this.i18n.t(TaskKeys.CREATE_SUCCESS),
      };
    } catch (error) {
      this.logger.error('Error creating task in TaskService:', error);
      throw error;
    }
  }

  async updateTask(
    user: JwtPayload,
    taskId: string,
    updateTaskDto: UpdateTaskDto,
    adminId?: string,
  ) {
    const updateTaskUserId = adminId ? adminId : user.id;

    const task = await this.taskModel.findOne({
      _id: new Types.ObjectId(taskId),
      userId: new Types.ObjectId(updateTaskUserId),
    });

    if (!task) {
      throw new NotFoundException(
        this.i18n.t(TaskKeys.NOT_FOUND, {
          args: { id: taskId },
        }),
      );
    }

    try {
      const updateFields: Record<string, any> = { ...updateTaskDto };
      if (updateFields.assignTo) {
        updateFields.assignTo = new Types.ObjectId(updateFields.assignTo as string);
      }

      await this.taskModel.findOneAndUpdate(
        {
          _id: new Types.ObjectId(taskId),
          userId: new Types.ObjectId(updateTaskUserId),
        },
        { $set: updateFields },
        { new: true },
      );

      return {
        success: true,
        message: this.i18n.t(TaskKeys.UPDATE_SUCCESS),
      };
    } catch (error) {
      this.logger.error('Error updating task in TaskService:', error);
      throw error;
    }
  }

  async deleteTask(user: JwtPayload, taskId: string) {
    const dbUser = await this.userModel.findById(user.id);

    if (!dbUser) {
      throw new NotFoundException('User not found');
    }

    if (dbUser.role !== 'admin') {
      throw new ForbiddenException(
        this.i18n.t(TaskKeys.FORBIDDEN_DELETE, {
          args: { id: taskId },
        }),
      );
    }

    await this.taskModel.findOneAndDelete({
      _id: new Types.ObjectId(taskId),
      userId: new Types.ObjectId(user.id),
    });

    return {
      success: true,
      message: this.i18n.t(TaskKeys.DELETE_SUCCESS, {
        args: { id: taskId },
      }),
    };
  }
}
