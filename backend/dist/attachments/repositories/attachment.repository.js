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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttachmentRepository = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const attachment_schema_1 = require("../schemas/attachment.schema");
let AttachmentRepository = class AttachmentRepository {
    constructor(attachmentModel) {
        this.attachmentModel = attachmentModel;
    }
    async create(data) {
        const created = new this.attachmentModel(data);
        return created.save();
    }
    async findByTaskId(taskId) {
        return this.attachmentModel
            .find({ taskId: new mongoose_2.Types.ObjectId(taskId) })
            .populate('uploadedBy', 'username email avatar')
            .sort({ createdAt: -1 })
            .exec();
    }
    async findById(id) {
        return this.attachmentModel.findById(id).exec();
    }
    async delete(id) {
        await this.attachmentModel.deleteOne({ _id: id }).exec();
    }
};
exports.AttachmentRepository = AttachmentRepository;
exports.AttachmentRepository = AttachmentRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(attachment_schema_1.Attachment.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], AttachmentRepository);
//# sourceMappingURL=attachment.repository.js.map