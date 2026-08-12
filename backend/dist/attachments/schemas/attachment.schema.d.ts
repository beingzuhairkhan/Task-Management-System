import { Document, Types } from 'mongoose';
export declare class Attachment extends Document {
    taskId: Types.ObjectId;
    uploadedBy: Types.ObjectId;
    fileName: string;
    url: string;
    mimeType: string;
    size: number;
}
export declare const AttachmentSchema: import("mongoose").Schema<Attachment, import("mongoose").Model<Attachment, any, any, any, Document<unknown, any, Attachment, any, {}> & Attachment & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Attachment, Document<unknown, {}, import("mongoose").FlatRecord<Attachment>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<Attachment> & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}>;
