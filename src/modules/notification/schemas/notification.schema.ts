import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type NotificationDocument = Notifications & Document;

@Schema({ timestamps: true })
export class NotificationItem {
  @Prop({ required: true })
  message: string;

  @Prop({ required: true })
  actionType: string;

  @Prop({ type: MongooseSchema.Types.Mixed, default: {} })
  actionData: any;
}

const NotificationItemSchema = SchemaFactory.createForClass(NotificationItem);

@Schema({ timestamps: true })
export class Notifications {
  @Prop()
  userId?: string;

  @Prop({
    required: false,
    index: true,
    sparse: true,
    unique: true,
  })
  email?: string;

  @Prop({ type: [NotificationItemSchema], default: [] })
  notifications: NotificationItem[];
}

export const NotificationSchema = SchemaFactory.createForClass(Notifications);
