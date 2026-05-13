import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminUserController } from './admin-user.controller';
import { AdminUserService } from './admin-user.service';
import { User, UserSchema } from '../account/schemas/user.schema';
import {
  Notifications,
  NotificationSchema,
} from '../notification/schemas/notification.schema';
import { Task, TaskSchema } from '../task/schemas/task.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Notifications.name, schema: NotificationSchema },
      { name: Task.name, schema: TaskSchema },
    ]),
  ],
  controllers: [AdminUserController],
  providers: [AdminUserService],
  exports: [AdminUserService],
})
export class AdminUserModule {}
