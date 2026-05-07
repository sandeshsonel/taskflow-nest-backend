import {
  Injectable,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { I18nService } from 'nestjs-i18n';

import { Task, TaskDocument, TaskItem } from './schemas/task.schema';
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
  ) { }

  async getTaskById(taskId: string, userId: string) {
    const userTask = await this.taskModel.findOne(
      {
        userId: new Types.ObjectId(userId),
        'tasks._id': new Types.ObjectId(taskId),
      },
      { 'tasks.$': 1 },
    );

    if (!userTask || !userTask.tasks.length) {
      throw new NotFoundException(
        this.i18n.t(TaskKeys.NOT_FOUND, {
          args: { id: taskId },
        }),
      );
    }

    return userTask.tasks[0];
  }

  async getTaskList(
    user: JwtPayload,
    page: number = 1,
    limit: number = 10,
    isAdmin: boolean = false,
  ) {
    const skip = (page - 1) * limit;
    const userId = user.id;

    let tasks: (TaskItem & { createdAt?: Date; assignBy?: any })[] = [];

    if (isAdmin) {
      const userTask = await this.taskModel.findOne({
        userId: new Types.ObjectId(userId),
      });
      tasks = (userTask?.tasks as any) ?? [];
    } else {
      const userTaskAgg = await this.taskModel.aggregate([
        {
          $match: {
            'tasks.assignTo': new Types.ObjectId(userId),
          },
        },
        {
          $addFields: {
            tasks: {
              $filter: {
                input: '$tasks',
                as: 't',
                cond: { $eq: ['$$t.assignTo', new Types.ObjectId(userId)] },
              },
            },
          },
        },
        {
          $lookup: {
            from: 'users',
            let: { uid: '$userId' },
            pipeline: [
              { $match: { $expr: { $eq: ['$_id', '$$uid'] } } },
              { $project: { _id: 1, fullName: 1 } },
            ],
            as: 'assignBy',
          },
        },
        { $unwind: '$assignBy' },
        {
          $addFields: {
            tasks: {
              $map: {
                input: '$tasks',
                as: 't',
                in: {
                  $mergeObjects: ['$$t', { assignBy: '$assignBy' }],
                },
              },
            },
          },
        },
        {
          $project: {
            _id: 0,
            tasks: 1,
          },
        },
        { $unwind: '$tasks' },
        { $replaceWith: '$tasks' },
      ]);
      tasks = userTaskAgg;
    }

    tasks.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });

    const paginated = tasks.slice(skip, skip + limit);

    return {
      data: paginated,
      page,
      limit,
      total: tasks.length,
      totalPages: Math.ceil(tasks.length / limit),
      hasMore: skip + limit < tasks.length,
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
        { 'tasks.assignTo': new Types.ObjectId(createUserId) },
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
        assignTo: createTaskDto.assignTo
          ? new Types.ObjectId(createTaskDto.assignTo)
          : new Types.ObjectId(user.id),
      };

      await this.taskModel.findOneAndUpdate(
        { userId: new Types.ObjectId(createUserId) },
        { $push: { tasks: taskData } },
        { new: true, upsert: true },
      );

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

    const userTask = await this.taskModel.findOne(
      {
        userId: new Types.ObjectId(updateTaskUserId),
        'tasks._id': new Types.ObjectId(taskId),
      },
      { 'tasks.$': 1 },
    );

    if (!userTask) {
      throw new NotFoundException(
        this.i18n.t(TaskKeys.NOT_FOUND, {
          args: { id: taskId },
        }),
      );
    }

    try {
      const updateFields: Record<string, any> = {};
      for (const [key, value] of Object.entries(updateTaskDto)) {
        if (value !== undefined) {
          if (key === 'assignTo' && value) {
            updateFields[`tasks.$.${key}`] = new Types.ObjectId(value as string);
          } else {
            updateFields[`tasks.$.${key}`] = value;
          }
        }
      }

      await this.taskModel.findOneAndUpdate(
        {
          userId: new Types.ObjectId(updateTaskUserId),
          'tasks._id': new Types.ObjectId(taskId),
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

    await this.taskModel.findOneAndUpdate(
      { userId: new Types.ObjectId(user.id) },
      {
        $pull: { tasks: { _id: new Types.ObjectId(taskId) } },
      },
    );

    return {
      success: true,
      message: this.i18n.t(TaskKeys.DELETE_SUCCESS, {
        args: { id: taskId },
      }),
    };
  }
}
