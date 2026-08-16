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
exports.TasksController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const tasks_service_1 = require("../services/tasks.service");
const create_task_dto_1 = require("../dto/create-task.dto");
const update_task_dto_1 = require("../dto/update-task.dto");
const move_task_dto_1 = require("../dto/move-task.dto");
const filter_task_dto_1 = require("../dto/filter-task.dto");
const common_2 = require("../../common");
let TasksController = class TasksController {
    constructor(tasksService) {
        this.tasksService = tasksService;
    }
    create(projectId, dto, user) {
        return this.tasksService.create(dto, projectId, user._id);
    }
    findAll(projectId, filterDto, dto, user) {
        return this.tasksService.findAll(projectId, filterDto, dto, user._id);
    }
    findOne(id) {
        return this.tasksService.findById(id);
    }
    update(id, dto, user) {
        return this.tasksService.update(id, dto, user._id);
    }
    move(id, dto, user) {
        return this.tasksService.move(id, dto, user._id);
    }
    async remove(id, user) {
        await this.tasksService.remove(id, user._id);
    }
};
exports.TasksController = TasksController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a task in a project' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Task created' }),
    __param(0, (0, common_1.Param)('projectId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_2.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_task_dto_1.CreateTaskDto, Object]),
    __metadata("design:returntype", void 0)
], TasksController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List tasks with filtering, search, pagination, sorting' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Paginated filtered tasks' }),
    __param(0, (0, common_1.Param)('projectId')),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Query)()),
    __param(3, (0, common_2.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, filter_task_dto_1.FilterTaskDto,
        common_2.PaginationDto, Object]),
    __metadata("design:returntype", void 0)
], TasksController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a task by id' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Task details' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TasksController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a task (assignees or creator only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Task updated' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_2.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_task_dto_1.UpdateTaskDto, Object]),
    __metadata("design:returntype", void 0)
], TasksController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/move'),
    (0, swagger_1.ApiOperation)({ summary: 'Move task to another group and/or reorder (drag & drop)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Task moved' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_2.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, move_task_dto_1.MoveTaskDto, Object]),
    __metadata("design:returntype", void 0)
], TasksController.prototype, "move", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a task' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Task deleted' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_2.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "remove", null);
exports.TasksController = TasksController = __decorate([
    (0, swagger_1.ApiTags)('Tasks'),
    (0, common_1.Controller)('projects/:projectId/tasks'),
    (0, common_1.UseGuards)(common_2.JwtAuthGuard),
    (0, common_2.Auth)(),
    __metadata("design:paramtypes", [tasks_service_1.TasksService])
], TasksController);
//# sourceMappingURL=tasks.controller.js.map