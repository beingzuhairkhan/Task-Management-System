import { AttachmentRepository } from '../repositories/attachment.repository';
export declare class AttachmentsService {
    private readonly attachmentRepository;
    constructor(attachmentRepository: AttachmentRepository);
    create(params: {
        taskId: string;
        userId: string;
        fileName: string;
        url: string;
        mimeType: string;
        size: number;
    }): Promise<import("../schemas/attachment.schema").Attachment>;
    findByTaskId(taskId: string): Promise<import("../schemas/attachment.schema").Attachment[]>;
    remove(id: string): Promise<void>;
}
