import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ProjectPriority, ProjectStatus, ProjectRole } from '../../common/enums';

@Schema({ _id: false })
class ProjectMember extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({ type: String, enum: Object.values(ProjectRole), required: true })
  role: ProjectRole;
}

const ProjectMemberSchema = SchemaFactory.createForClass(ProjectMember);

@Schema({ timestamps: true, versionKey: false })
export class Project extends Document {
  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true ,trim: true })
  description: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  owner: Types.ObjectId;

  @Prop({  type: [ProjectMemberSchema], default: [] })
  members: { user: Types.ObjectId; role: ProjectRole }[];

  @Prop({ required: true,type: String, enum: Object.values(ProjectPriority), default: ProjectPriority.MEDIUM })
  priority: ProjectPriority;

  @Prop({required: true, type: String, enum: Object.values(ProjectStatus), default: ProjectStatus.PLANNING })
  status: ProjectStatus;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  lead: Types.ObjectId;


  @Prop({ type: Date })
  startDate: Date;

  @Prop({ required: true,type: Date })
  dueDate: Date;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
ProjectSchema.set('toJSON', {
  virtuals: true,
  transform: (_doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    return ret;
  },
});
