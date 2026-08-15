import { Document, Types } from 'mongoose';
import { TaskStatus, TaskPriority, Group } from '../../common/enums';
export declare class Task extends Document {
    projectId: Types.ObjectId;
    ownerId: Types.ObjectId;
    group: Group;
    title: string;
    description?: string;
    status: TaskStatus;
    priority: TaskPriority;
    reporter: Types.ObjectId;
    members: Types.ObjectId[];
    labels: string[];
    dueDate?: Date;
    startDate?: Date;
    order: number;
    estimatedHours: number;
    spentHours: number;
    createdBy: Types.ObjectId;
    updatedBy?: Types.ObjectId;
    resources: string[];
    lead: Types.ObjectId;
}
export declare const TaskSchema: import("mongoose").Schema<Task, import("mongoose").Model<Task, any, any, any, Document<unknown, any, Task, any, {}> & Task & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Task, Document<unknown, {}, import("mongoose").FlatRecord<Task>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<Task> & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}>;
