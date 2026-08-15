import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { TaskStatus, TaskPriority, Group } from '../../common/enums';

@Schema({ timestamps: true, versionKey: false })
export class Task extends Document {
  @Prop({
    type: Types.ObjectId,
    ref: 'Project',
    required: true,
    index: true,
  })
  projectId: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  })
  ownerId: Types.ObjectId;

  @Prop({
    type: String,
    enum: Object.values(Group),
    default: Group.TODO,
    index: true,
  })
  group: Group;

  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ trim: true })
  description?: string;

  @Prop({
    type: String,
    enum: Object.values(TaskStatus),
    default: TaskStatus.PLANNED,
  })
  status: TaskStatus;

  @Prop({
    type: String,
    enum: Object.values(TaskPriority),
    default: TaskPriority.MEDIUM,
  })
  priority: TaskPriority;

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  })
  reporter: Types.ObjectId;

  @Prop({
    type: [{ type: Types.ObjectId, ref: 'User' }],
    default: [],
  })
  members: Types.ObjectId[];

  @Prop({
    type: [String],
    default: [],
  })
  labels: string[];

  @Prop({ type: Date })
  dueDate?: Date;

  @Prop({ type: Date })
  startDate?: Date;

  @Prop({ type: Number, default: 0 })
  order: number;

  @Prop({ type: Number, default: 0 })
  estimatedHours: number;

  @Prop({ type: Number, default: 0 })
  spentHours: number;

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  })
  createdBy: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
  })
  updatedBy?: Types.ObjectId;

  @Prop({
    type: [String],
    default: [],
  })
  resources: string[];

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  lead: Types.ObjectId;
}

export const TaskSchema = SchemaFactory.createForClass(Task);

TaskSchema.index({ projectId: 1, group: 1, order: 1 });
TaskSchema.index({ title: 'text', description: 'text' });

TaskSchema.set('toJSON', {
  virtuals: true,
  transform: (_doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    return ret;
  },
});