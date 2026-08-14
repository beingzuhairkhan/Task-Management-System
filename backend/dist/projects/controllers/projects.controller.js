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
exports.ProjectsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const projects_service_1 = require("../services/projects.service");
const create_project_dto_1 = require("../dto/create-project.dto");
const update_project_dto_1 = require("../dto/update-project.dto");
const invite_member_dto_1 = require("../dto/invite-member.dto");
const update_member_role_dto_1 = require("../dto/update-member-role.dto");
const common_2 = require("../../common");
const enums_1 = require("../../common/enums");
let ProjectsController = class ProjectsController {
    constructor(projectsService) {
        this.projectsService = projectsService;
    }
    create(dto, user) {
        return this.projectsService.create(dto, user._id);
    }
    findAll(dto, user) {
        return this.projectsService.findAll(dto, user._id);
    }
    findOne(id) {
        return this.projectsService.findById(id);
    }
    update(id, dto) {
        return this.projectsService.update(id, dto);
    }
    async remove(id, user) {
        await this.projectsService.remove(id, user._id);
    }
    inviteMember(id, dto) {
        return this.projectsService.inviteMember(id, dto);
    }
    updateMemberRole(id, userId, dto) {
        return this.projectsService.updateMemberRole(id, userId, dto);
    }
    removeMember(id, userId) {
        return this.projectsService.removeMember(id, userId);
    }
};
exports.ProjectsController = ProjectsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new project' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Project created' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_2.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_project_dto_1.CreateProjectDto, Object]),
    __metadata("design:returntype", void 0)
], ProjectsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List projects for the current user' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Paginated projects' }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_2.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_2.PaginationDto, Object]),
    __metadata("design:returntype", void 0)
], ProjectsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a project by id' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Project details' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProjectsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(common_2.ProjectRolesGuard),
    (0, common_2.ProjectRoles)(enums_1.ProjectRole.OWNER),
    (0, swagger_1.ApiOperation)({ summary: 'Update a project (owner only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Project updated' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_project_dto_1.UpdateProjectDto]),
    __metadata("design:returntype", void 0)
], ProjectsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(common_2.ProjectRolesGuard),
    (0, common_2.ProjectRoles)(enums_1.ProjectRole.OWNER),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a project (owner only)' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Project deleted' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_2.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ProjectsController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/members'),
    (0, common_1.UseGuards)(common_2.ProjectRolesGuard),
    (0, common_2.ProjectRoles)(enums_1.ProjectRole.OWNER),
    (0, swagger_1.ApiOperation)({ summary: 'Invite a member to the project (owner only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Member invited' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, invite_member_dto_1.InviteMemberDto]),
    __metadata("design:returntype", void 0)
], ProjectsController.prototype, "inviteMember", null);
__decorate([
    (0, common_1.Patch)(':id/members/:userId'),
    (0, common_1.UseGuards)(common_2.ProjectRolesGuard),
    (0, common_2.ProjectRoles)(enums_1.ProjectRole.OWNER),
    (0, swagger_1.ApiOperation)({ summary: 'Update a member role (owner only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Member role updated' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('userId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, update_member_role_dto_1.UpdateMemberRoleDto]),
    __metadata("design:returntype", void 0)
], ProjectsController.prototype, "updateMemberRole", null);
__decorate([
    (0, common_1.Delete)(':id/members/:userId'),
    (0, common_1.UseGuards)(common_2.ProjectRolesGuard),
    (0, common_2.ProjectRoles)(enums_1.ProjectRole.OWNER),
    (0, swagger_1.ApiOperation)({ summary: 'Remove a member from the project (owner only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Member removed' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ProjectsController.prototype, "removeMember", null);
exports.ProjectsController = ProjectsController = __decorate([
    (0, swagger_1.ApiTags)('Projects'),
    (0, common_1.Controller)('projects'),
    (0, common_1.UseGuards)(common_2.JwtAuthGuard),
    (0, common_2.Auth)(),
    __metadata("design:paramtypes", [projects_service_1.ProjectsService])
], ProjectsController);
//# sourceMappingURL=projects.controller.js.map