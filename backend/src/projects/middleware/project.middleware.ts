import {
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { ProjectsService } from '../services/projects.service';

@Injectable()
export class ProjectMiddleware implements CanActivate {
  constructor(private projectsService: ProjectsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const projectId =
      request.params.projectId || request.params.id || request.body?.projectId;

    if (projectId) {
      const project = await this.projectsService.findByIdAndLoad(projectId);
      request.project = project;
    }
    return true;
  }
}
