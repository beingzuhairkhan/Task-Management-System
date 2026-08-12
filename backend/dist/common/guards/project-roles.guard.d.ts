import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ProjectRepository } from '../../projects/repositories/project.repository';
export declare class ProjectRolesGuard implements CanActivate {
    private readonly reflector;
    private readonly projectRepository;
    private readonly logger;
    constructor(reflector: Reflector, projectRepository: ProjectRepository);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
