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
exports.SubtaskRepository = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const subtask_schema_1 = require("../schemas/subtask.schema");
const user_schema_1 = require("../../users/schemas/user.schema");
const task_schema_1 = require("../../tasks/schemas/task.schema");
let SubtaskRepository = class SubtaskRepository {
    constructor(subtaskModel, userModel, taskModel) {
        this.subtaskModel = subtaskModel;
        this.userModel = userModel;
        this.taskModel = taskModel;
    }
    async canAccessTask(taskId, userId) {
        const task = await this.taskModel.findById(taskId);
        if (!task) {
            throw new Error('Parent task not found');
        }
        const isTaskOwner = String(task.ownerId) === String(userId);
        const isTaskMember = Array.isArray(task.members) &&
            task.members.some((member) => String(member) === String(userId));
        const isTaskReporter = String(task.reporter) === String(userId);
        return (isTaskOwner ||
            isTaskMember ||
            isTaskReporter);
    }
    async allRoleAccess(subtaskId, userId) {
        const subtask = await this.subtaskModel.findById(subtaskId);
        if (!subtask) {
            throw new Error('Subtask not found');
        }
        const task = await this.taskModel.findById(subtask.taskId);
        if (!task) {
            throw new Error('Parent task not found');
        }
        const isTaskOwner = String(task.ownerId) === String(userId);
        const isTaskMember = Array.isArray(task.members) &&
            task.members.some((member) => String(member) === String(userId));
        const isTaskReporter = String(task.reporter) === String(userId);
        const isSubtaskMember = Array.isArray(subtask.subMembers) &&
            subtask.subMembers.some((member) => String(member) === String(userId));
        const isSubtaskCreator = String(subtask.createdBy) ===
            String(userId);
        return (isTaskOwner ||
            isTaskMember ||
            isTaskReporter ||
            isSubtaskMember ||
            isSubtaskCreator);
    }
    async create(data, taskId, userId) {
        const canAccess = await this.canAccessTask(taskId, userId);
        if (!canAccess) {
            throw new common_1.ForbiddenException('Only the task owner, task members, or task reporter can create a subtask');
        }
        const created = new this.subtaskModel(data);
        return created.save();
    }
    async findById(id) {
        return this.subtaskModel
            .findById(id)
            .populate('subMembers', 'username email avatar')
            .exec();
    }
    async findByTaskId(taskId) {
        return this.subtaskModel
            .find({
            taskId: new mongoose_2.Types.ObjectId(taskId),
        })
            .populate('subMembers', 'username email avatar')
            .sort({ order: 1 })
            .exec();
    }
    async update(id, data, userId) {
        const canAccess = await this.allRoleAccess(id, userId);
        if (!canAccess) {
            throw new common_1.ForbiddenException('Only the task owner, task members, task reporter, subtask members, or subtask creator can update this subtask');
        }
        return this.subtaskModel
            .findByIdAndUpdate(id, data, {
            new: true,
        })
            .populate('subMembers', 'username email avatar')
            .exec();
    }
    async delete(id, userId) {
        const canAccess = await this.allRoleAccess(id, userId);
        if (!canAccess) {
            throw new common_1.ForbiddenException('Only the task owner, task members, task reporter, subtask members, or subtask creator can delete this subtask');
        }
        await this.subtaskModel.findByIdAndDelete(id);
    }
};
exports.SubtaskRepository = SubtaskRepository;
exports.SubtaskRepository = SubtaskRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(subtask_schema_1.Subtask.name)),
    __param(1, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __param(2, (0, mongoose_1.InjectModel)(task_schema_1.Task.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], SubtaskRepository);
//# sourceMappingURL=subtask.repository.js.map