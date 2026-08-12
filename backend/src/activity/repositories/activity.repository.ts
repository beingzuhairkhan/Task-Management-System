import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Activity } from '../schemas/activity.schema';
import { ActivityAction } from 'src/common';

@Injectable()
export class ActivityRepository {
  private readonly logger = new Logger(ActivityRepository.name);

  constructor(@InjectModel(Activity.name) private activityModel: Model<Activity>) { }

  async create(data: Partial<Activity>): Promise<Activity> {
    try {
      const created = new this.activityModel({
        ...data,
        taskId: data.taskId ? new Types.ObjectId(String(data.taskId)) : undefined,
        userId: data.userId ? new Types.ObjectId(String(data.userId)) : undefined,
      });
      return await created.save();
    } catch (err) {
      this.logger.error(`Failed to log activity: ${(err as Error).message}`);
      return null as any;
    }
  }

  async findByTaskIds(taskIds: string[]): Promise<Activity[]> {
  const result = await this.activityModel
    .find({
      taskId: {
        $in: taskIds.map((id) => new Types.ObjectId(id)),
      },
      action: {
        $ne: 'UPDATED',
      },
    })
    .populate('userId', 'username email avatar')
    .sort({ createdAt: -1 })
    .limit(5)
    .exec();

  return result;
}
}
