import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type AdminUserDocument = AdminUser & Document;

@Schema({ timestamps: true })
export class SubUser {
  _id: any;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ default: null })
  email?: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, default: null, ref: 'User' })
  userId?: string;

  @Prop({ required: true, default: true })
  active: boolean;

  @Prop({ enum: ['invited', 'active', 'suspended'], default: 'invited' })
  status: string;

  @Prop({
    enum: ['admin', 'editor', 'viewer'],
    required: true,
    default: 'viewer',
  })
  role: string;

  @Prop({ default: null })
  joinedAt?: Date;

  @Prop({ default: null })
  lastLogin?: Date;

  @Prop({ required: true })
  password?: string;
}

const SubUserSchema = SchemaFactory.createForClass(SubUser);

@Schema({ timestamps: true })
export class AdminUser {
  @Prop({ required: true, unique: true })
  adminId: string;

  @Prop({ type: [SubUserSchema] })
  users: SubUser[];
}

export const AdminUserSchema = SchemaFactory.createForClass(AdminUser);
