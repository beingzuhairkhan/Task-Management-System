import { ProjectsService } from '../services/projects.service';
import { CreateProjectDto } from '../dto/create-project.dto';
import { UpdateProjectDto } from '../dto/update-project.dto';
import { InviteMemberDto } from '../dto/invite-member.dto';
import { UpdateMemberRoleDto } from '../dto/update-member-role.dto';
import { PaginationDto } from '../../common';
export declare class ProjectsController {
    private readonly projectsService;
    constructor(projectsService: ProjectsService);
    create(dto: CreateProjectDto, user: any): Promise<import("../schemas/project.schema").Project>;
    findAll(dto: PaginationDto, user: any): Promise<import("../../common").PaginatedResult<any>>;
    findOne(id: string): Promise<import("../schemas/project.schema").Project>;
    update(id: string, dto: UpdateProjectDto): Promise<any>;
    remove(id: string, user: any): Promise<void>;
    inviteMember(id: string, dto: InviteMemberDto): Promise<import("../schemas/project.schema").Project>;
    updateMemberRole(id: string, userId: string, dto: UpdateMemberRoleDto): Promise<import("../schemas/project.schema").Project>;
    removeMember(id: string, userId: string): Promise<import("../schemas/project.schema").Project>;
}
