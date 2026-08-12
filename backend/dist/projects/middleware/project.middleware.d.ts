import { CanActivate, ExecutionContext } from '@nestjs/common';
import { ProjectsService } from '../services/projects.service';
export declare class ProjectMiddleware implements CanActivate {
    private projectsService;
    constructor(projectsService: ProjectsService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
