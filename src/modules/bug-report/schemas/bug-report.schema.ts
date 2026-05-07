import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BugReportDocument = BugReport & Document;

@Schema({ timestamps: true })
export class BugReport {
  @Prop({ default: null })
  fullName: string;

  @Prop({ default: null })
  email: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: [String], default: [] })
  attachments: string[];
}

export const BugReportSchema = SchemaFactory.createForClass(BugReport);
