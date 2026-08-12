import { Document, Types } from 'mongoose';
import { ActivityAction } from '../../common/enums';
export declare class Activity extends Document {
    taskId: Types.ObjectId;
    userId: Types.ObjectId;
    action: ActivityAction;
    oldValue: string;
    newValue: string;
}
export declare const ActivitySchema: import("mongoose").Schema<Activity, import("mongoose").Model<Activity, any, any, any, Document<unknown, any, Activity, any, {}> & Activity & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Activity, Document<unknown, {}, import("mongoose").FlatRecord<Activity>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<Activity> & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}>;
