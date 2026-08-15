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
exports.TasksService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const mongoose_2 = require("@nestjs/mongoose");
const task_repository_1 = require("../repositories/task.repository");
const activity_service_1 = require("../../activity/services/activity.service");
const common_2 = require("../../common");
const enums_1 = require("../../common/enums");
const project_schema_1 = require("../../projects/schemas/project.schema");
const subtask_schema_1 = require("../../subtasks/schemas/subtask.schema");
let TasksService = class TasksService {
    constructor(taskRepository, activityService, projectModel, subTaskModel) {
        this.taskRepository = taskRepository;
        this.activityService = activityService;
        this.projectModel = projectModel;
        this.subTaskModel = subTaskModel;
    }
    async create(dto, projectId, userId) {
        try {
            const project = await this.projectModel
                .findById(projectId)
                .select('lead')
                .lean();
            if (!project) {
                throw new common_2.NotFoundException('Project not found');
            }
            const task = await this.taskRepository.create({
                ...dto,
                projectId: new mongoose_1.Types.ObjectId(projectId),
                ownerId: new mongoose_1.Types.ObjectId(userId),
                reporter: new mongoose_1.Types.ObjectId(dto.reporter),
                createdBy: new mongoose_1.Types.ObjectId(userId),
                members: (dto.members || []).map((id) => new mongoose_1.Types.ObjectId(id)),
                labels: dto.labels || [],
                status: dto.status || enums_1.TaskStatus.PLANNED,
                priority: dto.priority || enums_1.TaskPriority.MEDIUM,
                dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
                startDate: dto.startDate ? new Date(dto.startDate) : undefined,
                lead: new mongoose_1.Types.ObjectId(project.lead)
            });
            await this.activityService.log({
                taskId: String(task._id),
                userId,
                action: enums_1.ActivityAction.CREATED,
            });
            return task;
        }
        catch (err) {
            throw err;
        }
    }
    async findAll(projectId, filterDto, dto, userId) {
        const project = await this.projectModel
            .findById(projectId)
            .select('owner lead')
            .lean();
        if (!project) {
            throw new common_2.NotFoundException('Project not found');
        }
        const userObjectId = new mongoose_1.Types.ObjectId(userId);
        const isProjectOwner = project.owner?.equals(userObjectId);
        const isProjectLead = project.lead?.equals(userObjectId);
        let subTaskTaskIds = [];
        if (!isProjectOwner && !isProjectLead) {
            const subTasks = await this.subTaskModel
                .find({
                subMembers: userObjectId,
            })
                .select('taskId')
                .lean();
            subTaskTaskIds = subTasks.map((subTask) => subTask.taskId);
        }
        const filter = this.taskRepository.buildFilter(projectId, filterDto, dto.search, userId, project.owner, project.lead, subTaskTaskIds);
        const sort = (0, common_2.buildSortOption)(dto.sort);
        const page = dto.page || 1;
        const limit = dto.limit || 20;
        const skip = (page - 1) * limit;
        const [tasks, total] = await Promise.all([
            this.taskRepository.findAll(filter, sort, skip, limit),
            this.taskRepository.count(filter),
        ]);
        return (0, common_2.paginateResult)(tasks, total, dto);
    }
    async findById(id) {
        const task = await this.taskRepository.findById(id);
        if (!task)
            throw new common_2.NotFoundException('Task', id);
        return task;
    }
    async update(id, dto, userId) {
        try {
            const existing = await this.taskRepository.findByIdLean(id);
            if (!existing) {
                throw new common_2.NotFoundException('Task', id);
            }
            const isMember = existing.members.some((m) => String(m) === String(userId));
            const isCreator = String(existing.ownerId) === String(userId);
            const isReporter = String(existing.reporter) === String(userId);
            if (!isMember && !isCreator && !isReporter) {
                throw new common_2.ForbiddenException('Only members, the task creator, or the reporter can update this task');
            }
            if (dto.title !== undefined && dto.title !== existing.title) {
                await this.activityService.log({
                    taskId: id,
                    userId,
                    action: enums_1.ActivityAction.UPDATED,
                    oldValue: existing.title,
                    newValue: dto.title,
                });
            }
            if (dto.description !== undefined &&
                dto.description !== existing.description) {
                await this.activityService.log({
                    taskId: id,
                    userId,
                    action: enums_1.ActivityAction.UPDATED,
                    oldValue: existing.description || '',
                    newValue: dto.description,
                });
            }
            if (dto.reporter !== undefined &&
                String(dto.reporter) !== String(existing.reporter)) {
                await this.activityService.log({
                    taskId: id,
                    userId,
                    action: enums_1.ActivityAction.UPDATED,
                    oldValue: String(existing.reporter),
                    newValue: String(dto.reporter),
                });
            }
            if (dto.status !== undefined && dto.status !== existing.status) {
                await this.activityService.log({
                    taskId: id,
                    userId,
                    action: enums_1.ActivityAction.STATUS_CHANGED,
                    oldValue: existing.status,
                    newValue: dto.status,
                });
            }
            if (dto.priority !== undefined && dto.priority !== existing.priority) {
                await this.activityService.log({
                    taskId: id,
                    userId,
                    action: enums_1.ActivityAction.PRIORITY_CHANGED,
                    oldValue: existing.priority,
                    newValue: dto.priority,
                });
            }
            if (dto.dueDate !== undefined &&
                dto.dueDate !== existing.dueDate) {
                await this.activityService.log({
                    taskId: id,
                    userId,
                    action: enums_1.ActivityAction.DUE_DATE_CHANGED,
                    oldValue: existing.dueDate,
                    newValue: dto.dueDate,
                });
            }
            if (dto.group !== undefined && dto.group !== existing.group) {
                await this.activityService.log({
                    taskId: id,
                    userId,
                    action: enums_1.ActivityAction.MOVED,
                    oldValue: `group:${existing.group}, order:${existing.order}`,
                    newValue: `group:${dto.group}, order:${existing.order}`,
                });
            }
            const updateData = {
                updatedBy: new mongoose_1.Types.ObjectId(userId),
            };
            if (dto.title !== undefined) {
                updateData.title = dto.title;
            }
            if (dto.description !== undefined) {
                updateData.description = dto.description;
            }
            if (dto.reporter !== undefined) {
                updateData.reporter = new mongoose_1.Types.ObjectId(dto.reporter);
            }
            if (dto.status !== undefined) {
                updateData.status = dto.status;
            }
            if (dto.group !== undefined) {
                updateData.group = dto.group;
            }
            if (dto.priority !== undefined) {
                updateData.priority = dto.priority;
            }
            if (dto.members !== undefined) {
                updateData.members = dto.members.map((memberId) => new mongoose_1.Types.ObjectId(memberId));
            }
            if (dto.labels !== undefined) {
                updateData.labels = dto.labels;
            }
            if (dto.resources !== undefined) {
                updateData.resources = dto.resources;
            }
            if (dto.dueDate !== undefined) {
                updateData.dueDate = dto.dueDate
                    ? new Date(dto.dueDate)
                    : undefined;
            }
            const task = await this.taskRepository.update(id, updateData);
            await this.activityService.log({
                taskId: id,
                userId,
                action: enums_1.ActivityAction.UPDATED,
            });
            return task;
        }
        catch (err) {
            throw err;
        }
    }
    async move(id, dto, userId) {
        try {
            const existing = await this.taskRepository.findByIdLean(id);
            if (!existing) {
                throw new common_2.NotFoundException("Task", id);
            }
            const oldGroup = String(existing.groupId);
            const oldOrder = existing.order;
            const newGroup = String(dto.groupId);
            if (oldGroup === newGroup) {
                throw new common_1.BadRequestException("Task is already in this group");
            }
            const task = await this.taskRepository.move(id, dto.groupId);
            await this.activityService.log({
                taskId: id,
                userId,
                action: enums_1.ActivityAction.MOVED,
                oldValue: `group:${oldGroup}, order:${oldOrder}`,
            });
            return task;
        }
        catch (error) {
            console.error("MOVE TASK ERROR:", error);
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException(error instanceof Error ? error.message : "Failed to move task");
        }
    }
    async assign(id, userId, assignerId) {
        const existing = await this.taskRepository.findByIdLean(id);
        if (!existing)
            throw new common_2.NotFoundException('Task', id);
        const task = await this.taskRepository.addAssignee(id, userId);
        await this.activityService.log({
            taskId: id,
            userId: assignerId,
            action: enums_1.ActivityAction.ASSIGNED,
            newValue: userId,
        });
        return task;
    }
    async unassign(id, userId, unassignerId) {
        const existing = await this.taskRepository.findByIdLean(id);
        if (!existing)
            throw new common_2.NotFoundException('Task', id);
        const task = await this.taskRepository.removeAssignee(id, userId);
        await this.activityService.log({
            taskId: id,
            userId: unassignerId,
            action: enums_1.ActivityAction.UNASSIGNED,
            oldValue: userId,
        });
        return task;
    }
    async remove(id, userId) {
        try {
            const existing = await this.taskRepository.findById(id);
            if (!existing) {
                throw new common_2.NotFoundException('Task', id);
            }
            const isMember = existing.members.some((m) => String(m) === String(userId));
            const isCreator = String(existing.ownerId) === String(userId);
            const isReporter = String(existing.reporter) === String(userId);
            if (!isMember && !isCreator && !isReporter) {
                throw new common_2.ForbiddenException('Only members, the task creator, or the reporter can delete this task');
            }
            await this.activityService.log({
                taskId: id,
                userId,
                action: enums_1.ActivityAction.DELETED,
            });
            await this.taskRepository.delete(id);
        }
        catch (error) {
            if (error instanceof common_2.NotFoundException) {
                throw error;
            }
            if (error instanceof common_2.ForbiddenException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('Failed to delete task');
        }
    }
};
exports.TasksService = TasksService;
exports.TasksService = TasksService = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, mongoose_2.InjectModel)(project_schema_1.Project.name)),
    __param(3, (0, mongoose_2.InjectModel)(subtask_schema_1.Subtask.name)),
    __metadata("design:paramtypes", [task_repository_1.TaskRepository,
        activity_service_1.ActivityService,
        mongoose_1.Model,
        mongoose_1.Model])
], TasksService);
//# sourceMappingURL=tasks.service.js.map