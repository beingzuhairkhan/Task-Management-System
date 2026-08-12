import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ProjectStatus, TaskPriority } from '../../common/enums';

@Schema({ timestamps: true, versionKey: false })
export class Subtask extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Task', required: true, index: true })
  taskId: Types.ObjectId;

  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ trim: true })
  description: string;

  @Prop({ type: String, enum: Object.values(ProjectStatus), default: ProjectStatus.PLANNING })
  status: ProjectStatus;

  @Prop({ type: String, enum: Object.values(TaskPriority), default: TaskPriority.MEDIUM })
  priority: TaskPriority;

  @Prop({
  type: Types.ObjectId,
  ref: 'User',
  default: null,
})
subMembers?: Types.ObjectId;

  @Prop({ type: Date })
  dueDate: Date;

  @Prop({ type: Number, default: 0 })
  order: number;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: Types.ObjectId;
}

export const SubtaskSchema = SchemaFactory.createForClass(Subtask);
SubtaskSchema.index({ taskId: 1, order: 1 });
SubtaskSchema.set('toJSON', {
  virtuals: true,
  transform: (_doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    return ret;
  },
});
