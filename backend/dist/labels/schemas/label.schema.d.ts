import { Document, Types } from 'mongoose';
export declare class Label extends Document {
    name: string;
}
export declare const LabelSchema: import("mongoose").Schema<Label, import("mongoose").Model<Label, any, any, any, Document<unknown, any, Label, any, {}> & Label & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Label, Document<unknown, {}, import("mongoose").FlatRecord<Label>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<Label> & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}>;
