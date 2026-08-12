import { Document, Types } from 'mongoose';
export declare class Group extends Document {
    projectId: Types.ObjectId;
    name: string;
    color: string;
    order: number;
}
export declare const GroupSchema: import("mongoose").Schema<Group, import("mongoose").Model<Group, any, any, any, Document<unknown, any, Group, any, {}> & Group & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Group, Document<unknown, {}, import("mongoose").FlatRecord<Group>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<Group> & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}>;
