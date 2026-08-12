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
var ProjectRolesGuard_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectRolesGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const project_roles_decorator_1 = require("../decorators/project-roles.decorator");
const project_repository_1 = require("../../projects/repositories/project.repository");
let ProjectRolesGuard = ProjectRolesGuard_1 = class ProjectRolesGuard {
    constructor(reflector, projectRepository) {
        this.reflector = reflector;
        this.projectRepository = projectRepository;
        this.logger = new common_1.Logger(ProjectRolesGuard_1.name);
    }
    async canActivate(context) {
        const requiredRoles = this.reflector.getAllAndOverride(project_roles_decorator_1.PROJECT_ROLES_KEY, [context.getHandler(), context.getClass()]);
        if (!requiredRoles?.length) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        if (!user) {
            throw new common_1.ForbiddenException('User not authenticated');
        }
        if (user.role === 'ADMIN') {
            return true;
        }
        const projectId = request.params.id;
        if (!projectId) {
            throw new common_1.ForbiddenException('Project ID is required');
        }
        const project = await this.projectRepository.findById(projectId);
        if (!project) {
            throw new common_1.NotFoundException('Project not found');
        }
        const userId = String(user._id ?? user.id ?? user.userId);
        const ownerId = String(project.owner?._id ?? project.owner);
        this.logger.debug(`USER ID: ${userId}`);
        this.logger.debug(`OWNER ID: ${ownerId}`);
        if (ownerId === userId) {
            this.logger.debug(`User ${userId} is OWNER of project ${projectId}`);
            return true;
        }
        if (Array.isArray(project.members)) {
            const membership = project.members.find((member) => String(member.user) === userId);
            if (membership &&
                requiredRoles.includes(membership.role)) {
                return true;
            }
        }
        this.logger.warn(`User ${userId} denied access to project ${projectId} - requires ${requiredRoles.join(', ')}`);
        throw new common_1.ForbiddenException('You do not have permission to perform this action');
    }
};
exports.ProjectRolesGuard = ProjectRolesGuard;
exports.ProjectRolesGuard = ProjectRolesGuard = ProjectRolesGuard_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector,
        project_repository_1.ProjectRepository])
], ProjectRolesGuard);
//# sourceMappingURL=project-roles.guard.js.map