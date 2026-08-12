import { Document, Types } from 'mongoose';
import { ProjectStatus, TaskPriority } from '../../common/enums';
export declare class Subtask extends Document {
    taskId: Types.ObjectId;
    title: string;
    description: string;
    status: ProjectStatus;
    priority: TaskPriority;
    subMembers?: Types.ObjectId;
    dueDate: Date;
    order: number;
    createdBy: Types.ObjectId;
}
export declare const SubtaskSchema: import("mongoose").Schema<Subtask, import("mongoose").Model<Subtask, any, any, any, Document<unknown, any, Subtask, any, {}> & Subtask & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Subtask, Document<unknown, {}, import("mongoose").FlatRecord<Subtask>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<Subtask> & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}>;
