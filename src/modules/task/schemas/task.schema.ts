import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { User } from '@modules/account/schemas/user.schema';
import { AdminUser } from '@modules/account/schemas/admin-user.schema';

export type TaskDocument = Task & Document;

@Schema({ timestamps: true })
export class TaskItem {
    @Prop({ required: true, index: true })
    title: string;

    @Prop({ required: true })
    description: string;

    @Prop({
        type: String,
        enum: ['pending', 'in-progress', 'completed'],
        default: 'pending',
    })
    status: string;

    @Prop({
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'low',
    })
    priority: string;

    @Prop({
        type: MongooseSchema.Types.ObjectId,
        ref: 'AdminUser',
        default: null,
    })
    assignTo: Types.ObjectId | AdminUser;
}

const TaskItemSchema = SchemaFactory.createForClass(TaskItem);

@Schema({ timestamps: true })
export class Task {
    @Prop({
        type: MongooseSchema.Types.ObjectId,
        ref: 'User',
        required: true,
    })
    userId: Types.ObjectId | User;

    @Prop({ type: [TaskItemSchema] })
    tasks: TaskItem[];
}

export const TaskSchema = SchemaFactory.createForClass(Task);

