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
exports.CommentsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const comment_repository_1 = require("../repositories/comment.repository");
const activity_service_1 = require("../../activity/services/activity.service");
const common_2 = require("../../common");
const enums_1 = require("../../common/enums");
let CommentsService = class CommentsService {
    constructor(commentRepository, activityService) {
        this.commentRepository = commentRepository;
        this.activityService = activityService;
    }
    async create(dto, taskId, userId) {
        const comment = await this.commentRepository.create({
            ...dto,
            taskId: new mongoose_1.Types.ObjectId(taskId),
            userId: new mongoose_1.Types.ObjectId(userId),
        });
        await this.activityService.log({
            taskId,
            userId,
            action: enums_1.ActivityAction.COMMENTED,
            newValue: dto.message,
        });
        return comment;
    }
    async findByTaskId(taskId) {
        return this.commentRepository.findByTaskId(taskId);
    }
    async update(id, dto, userId) {
        const comment = await this.commentRepository.findById(id);
        if (!comment)
            throw new common_2.NotFoundException('Comment', id);
        if (String(comment.userId) !== String(userId)) {
            throw new common_2.ForbiddenException('You can only edit your own comments');
        }
        return this.commentRepository.update(id, dto);
    }
    async remove(id, userId) {
        const comment = await this.commentRepository.findById(id);
        if (!comment)
            throw new common_2.NotFoundException('Comment', id);
        if (String(comment.userId._id) !== String(userId)) {
            throw new common_2.ForbiddenException('You can only delete your own comments');
        }
        await this.commentRepository.delete(id);
        await this.activityService.log({
            taskId: String(comment.taskId),
            userId,
            action: enums_1.ActivityAction.COMMENT_DELETED,
            oldValue: comment.message,
        });
    }
};
exports.CommentsService = CommentsService;
exports.CommentsService = CommentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [comment_repository_1.CommentRepository,
        activity_service_1.ActivityService])
], CommentsService);
//# sourceMappingURL=comments.service.js.map