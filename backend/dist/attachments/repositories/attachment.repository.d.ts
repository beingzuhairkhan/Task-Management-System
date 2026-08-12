import { Model } from 'mongoose';
import { Attachment } from '../schemas/attachment.schema';
export declare class AttachmentRepository {
    private attachmentModel;
    constructor(attachmentModel: Model<Attachment>);
    create(data: Partial<Attachment>): Promise<Attachment>;
    findByTaskId(taskId: string): Promise<Attachment[]>;
    findById(id: string): Promise<Attachment | null>;
    delete(id: string): Promise<void>;
}
