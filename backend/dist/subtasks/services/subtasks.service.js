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
exports.SubtasksService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const subtask_repository_1 = require("../repositories/subtask.repository");
const activity_service_1 = require("../../activity/services/activity.service");
const common_2 = require("../../common");
const enums_1 = require("../../common/enums");
let SubtasksService = class SubtasksService {
    constructor(subtaskRepository, activityService) {
        this.subtaskRepository = subtaskRepository;
        this.activityService = activityService;
    }
    async create(dto, taskId, userId) {
        const subtask = await this.subtaskRepository.create({
            ...dto,
            taskId: new mongoose_1.Types.ObjectId(taskId),
            createdBy: new mongoose_1.Types.ObjectId(userId),
            subMembers: dto.subMembers
                ? new mongoose_1.Types.ObjectId(dto.subMembers)
                : undefined,
            status: dto.status ||
                enums_1.ProjectStatus.PLANNING,
            priority: dto.priority ||
                enums_1.TaskPriority.MEDIUM,
            dueDate: dto.dueDate
                ? new Date(dto.dueDate)
                : undefined,
        }, taskId, userId);
        await this.activityService.log({
            taskId,
            userId,
            action: enums_1.ActivityAction.CREATED,
            newValue: `Subtask: ${subtask.title}`,
        });
        return subtask;
    }
    async findByTaskId(taskId) {
        return this.subtaskRepository
            .findByTaskId(taskId);
    }
    async findById(id) {
        const subtask = await this.subtaskRepository
            .findById(id);
        if (!subtask) {
            throw new common_2.NotFoundException('Subtask', id);
        }
        return subtask;
    }
    async update(id, dto, userId) {
        const subtask = await this.subtaskRepository.update(id, dto, userId);
        if (!subtask) {
            throw new common_2.NotFoundException('Subtask', id);
        }
        const changes = Object.entries(dto)
            .filter(([, value]) => value !== undefined &&
            value !== null)
            .map(([key, value]) => `${key}: ${value}`)
            .join(', ');
        await this.activityService.log({
            taskId: String(subtask.taskId),
            userId,
            action: enums_1.ActivityAction.STATUS_CHANGED,
            newValue: changes ||
                `Subtask: ${subtask.title}`,
        });
        return subtask;
    }
    async remove(id, userId) {
        const subtask = await this.subtaskRepository
            .findById(id);
        if (!subtask) {
            throw new common_2.NotFoundException('Subtask', id);
        }
        await this.subtaskRepository.delete(id, userId);
        await this.activityService.log({
            taskId: String(subtask.taskId),
            userId,
            action: enums_1.ActivityAction.DELETED,
            newValue: `Subtask: ${subtask.title}`,
        });
    }
};
exports.SubtasksService = SubtasksService;
exports.SubtasksService = SubtasksService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [subtask_repository_1.SubtaskRepository,
        activity_service_1.ActivityService])
], SubtasksService);
//# sourceMappingURL=subtasks.service.js.map