import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ unique: true, sparse: true })
  firebaseUID?: string;

  @Prop({ required: false })
  fullName?: string;

  @Prop({ required: false })
  firstName?: string;

  @Prop({ required: false })
  lastName?: string;

  @Prop({ required: true, unique: true, lowercase: true })
  email: string;

  @Prop({ default: null })
  password?: string;

  @Prop({ required: false })
  photoURL?: string;

  @Prop({ enum: ['admin', 'user', 'editor', 'viewer'], default: 'user' })
  role: string;

  @Prop({ enum: ['active', 'suspended', 'invited'], default: 'active' })
  status: string;

  @Prop({ default: true })
  active?: boolean;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', default: null })
  adminId?: string;

  @Prop({ default: null })
  joinedAt?: Date;

  @Prop({ default: null })
  lastLogin?: Date;

  createdAt?: Date;
  updatedAt?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
