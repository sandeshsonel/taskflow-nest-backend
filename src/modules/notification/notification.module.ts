import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Notifications, NotificationSchema } from './schemas/notification.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Notifications.name, schema: NotificationSchema },
    ]),
  ],
  exports: [MongooseModule],
})
export class NotificationModule {}
