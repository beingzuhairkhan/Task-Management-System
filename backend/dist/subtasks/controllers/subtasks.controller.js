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
exports.SubtasksController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const subtasks_service_1 = require("../services/subtasks.service");
const create_subtask_dto_1 = require("../dto/create-subtask.dto");
const update_subtask_dto_1 = require("../dto/update-subtask.dto");
const common_2 = require("../../common");
let SubtasksController = class SubtasksController {
    constructor(subtasksService) {
        this.subtasksService = subtasksService;
    }
    create(taskId, dto, user) {
        return this.subtasksService.create(dto, taskId, user._id);
    }
    findAll(taskId) {
        return this.subtasksService.findByTaskId(taskId);
    }
    update(id, dto, user) {
        return this.subtasksService.update(id, dto, user._id);
    }
    async remove(id, user) {
        await this.subtasksService.remove(id, user._id);
    }
};
exports.SubtasksController = SubtasksController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a subtask under a task' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Subtask created' }),
    __param(0, (0, common_1.Param)('taskId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_2.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_subtask_dto_1.CreateSubtaskDto, Object]),
    __metadata("design:returntype", void 0)
], SubtasksController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List subtasks for a task' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of subtasks' }),
    __param(0, (0, common_1.Param)('taskId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SubtasksController.prototype, "findAll", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a subtask' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Subtask updated' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_2.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_subtask_dto_1.UpdateSubtaskDto, Object]),
    __metadata("design:returntype", void 0)
], SubtasksController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a subtask' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Subtask deleted' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_2.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SubtasksController.prototype, "remove", null);
exports.SubtasksController = SubtasksController = __decorate([
    (0, swagger_1.ApiTags)('Subtasks'),
    (0, common_1.Controller)('tasks/:taskId/subtasks'),
    (0, common_1.UseGuards)(common_2.JwtAuthGuard),
    (0, common_2.Auth)(),
    __metadata("design:paramtypes", [subtasks_service_1.SubtasksService])
], SubtasksController);
//# sourceMappingURL=subtasks.controller.js.map