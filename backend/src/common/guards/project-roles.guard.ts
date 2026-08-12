import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ProjectRole } from '../enums';
import { PROJECT_ROLES_KEY } from '../decorators/project-roles.decorator';
import { ProjectRepository } from '../../projects/repositories/project.repository';

@Injectable()
export class ProjectRolesGuard implements CanActivate {
  private readonly logger = new Logger(ProjectRolesGuard.name);

  constructor(
    private readonly reflector: Reflector,
    private readonly projectRepository: ProjectRepository,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<ProjectRole[]>(
      PROJECT_ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles?.length) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    if (user.role === 'ADMIN') {
      return true;
    }

    const projectId = request.params.id;

    if (!projectId) {
      throw new ForbiddenException('Project ID is required');
    }

    const project = await this.projectRepository.findById(projectId);

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const userId = String(user._id ?? user.id ?? user.userId);

    const ownerId = String(
      project.owner?._id ?? project.owner
    );

    this.logger.debug(`USER ID: ${userId}`);
    this.logger.debug(`OWNER ID: ${ownerId}`);

    if (ownerId === userId) {
      this.logger.debug(
        `User ${userId} is OWNER of project ${projectId}`,
      );

      return true;
    }

    if (Array.isArray(project.members)) {
      const membership = project.members.find(
        (member: any) =>
          String(member.user) === userId,
      );

      if (
        membership &&
        requiredRoles.includes(membership.role)
      ) {
        return true;
      }
    }

    this.logger.warn(
      `User ${userId} denied access to project ${projectId} - requires ${requiredRoles.join(', ')}`,
    );

    throw new ForbiddenException(
      'You do not have permission to perform this action',
    );
  }
}