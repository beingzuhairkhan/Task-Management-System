import { Model } from 'mongoose';
import { Activity } from '../schemas/activity.schema';
export declare class ActivityRepository {
    private activityModel;
    private readonly logger;
    constructor(activityModel: Model<Activity>);
    create(data: Partial<Activity>): Promise<Activity>;
    findByTaskIds(taskIds: string[]): Promise<Activity[]>;
}
