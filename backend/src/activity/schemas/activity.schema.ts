import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ActivityAction } from '../../common/enums';

@Schema({ timestamps: true, versionKey: false })
export class Activity extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Task', required: true, index: true })
  taskId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: String, enum: Object.values(ActivityAction), required: true })
  action: ActivityAction;

  @Prop()
  oldValue: string;

  @Prop()
  newValue: string;
}

export const ActivitySchema = SchemaFactory.createForClass(Activity);
ActivitySchema.set('toJSON', {
  virtuals: true,
  transform: (_doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    return ret;
  },
});
