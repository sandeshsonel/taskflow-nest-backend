import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ unique: true, sparse: true })
  firebaseUID?: string;

  @Prop({ required: false })
  fullName?: string;

  @Prop({ required: true, unique: true, lowercase: true })
  email: string;

  @Prop({ default: null })
  password?: string;

  @Prop({ required: false })
  photoURL?: string;

  @Prop({ enum: ['admin', 'user'], default: 'user' })
  role: string;

  @Prop({ enum: ['active', 'suspended'], default: 'active' })
  status: string;

  createdAt?: Date;
  updatedAt?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
