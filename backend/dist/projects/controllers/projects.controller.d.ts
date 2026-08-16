import { ProjectsService } from '../services/projects.service';
import { CreateProjectDto } from '../dto/create-project.dto';
import { UpdateProjectDto } from '../dto/update-project.dto';
import { GenerateDescriptionDto } from '../dto/generate-description.dto';
import { PaginationDto } from '../../common';
export declare class ProjectsController {
    private readonly projectsService;
    constructor(projectsService: ProjectsService);
    create(dto: CreateProjectDto, user: any): Promise<import("../schemas/project.schema").Project>;
    findAll(dto: PaginationDto, user: any): Promise<import("../../common").PaginatedResult<any>>;
    findOne(id: string): Promise<import("../schemas/project.schema").Project>;
    update(id: string, dto: UpdateProjectDto): Promise<any>;
    remove(id: string, user: any): Promise<void>;
    generateDescription(dto: GenerateDescriptionDto): Promise<{
        description: string;
    }>;
}
