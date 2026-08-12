import { AttachmentsService } from '../services/attachments.service';
export declare class AttachmentsController {
    private readonly attachmentsService;
    constructor(attachmentsService: AttachmentsService);
    upload(taskId: string, file: Express.Multer.File, user: any): Promise<import("../schemas/attachment.schema").Attachment>;
    findAll(taskId: string): Promise<import("../schemas/attachment.schema").Attachment[]>;
    remove(id: string): Promise<void>;
}
