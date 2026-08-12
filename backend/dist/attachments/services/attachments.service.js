"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttachmentsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const attachment_repository_1 = require("../repositories/attachment.repository");
const common_2 = require("../../common");
let AttachmentsService = class AttachmentsService {
    constructor(attachmentRepository) {
        this.attachmentRepository = attachmentRepository;
    }
    async create(params) {
        return this.attachmentRepository.create({
            taskId: new mongoose_1.Types.ObjectId(params.taskId),
            uploadedBy: new mongoose_1.Types.ObjectId(params.userId),
            fileName: params.fileName,
            url: params.url,
            mimeType: params.mimeType,
            size: params.size,
        });
    }
    async findByTaskId(taskId) {
        return this.attachmentRepository.findByTaskId(taskId);
    }
    async remove(id) {
        const attachment = await this.attachmentRepository.findById(id);
        if (!attachment)
            throw new common_2.NotFoundException('Attachment', id);
        await this.attachmentRepository.delete(id);
    }
};
exports.AttachmentsService = AttachmentsService;
exports.AttachmentsService = AttachmentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [attachment_repository_1.AttachmentRepository])
], AttachmentsService);
//# sourceMappingURL=attachments.service.js.map