import { Model } from 'mongoose';
import { ProjectRepository } from '../repositories/project.repository';
import { UserRepository } from '../../users/repositories/user.repository';
import { CreateProjectDto } from '../dto/create-project.dto';
import { UpdateProjectDto } from '../dto/update-project.dto';
import { InviteMemberDto } from '../dto/invite-member.dto';
import { UpdateMemberRoleDto } from '../dto/update-member-role.dto';
import { PaginationDto, PaginatedResult } from '../../common';
import { ProjectRole } from '../../common/enums';
import { User } from '../../users/schemas/user.schema';
export declare class ProjectsService {
    private readonly projectRepository;
    private readonly userRepository;
    private readonly userModel;
    private readonly logger;
    constructor(projectRepository: ProjectRepository, userRepository: UserRepository, userModel: Model<User>);
    create(dto: CreateProjectDto, userId: string): Promise<import("../schemas/project.schema").Project>;
    findAll(dto: PaginationDto, userId: string): Promise<PaginatedResult<any>>;
    findById(id: string): Promise<import("../schemas/project.schema").Project>;
    findByIdAndLoad(id: string): Promise<any>;
    update(id: string, dto: UpdateProjectDto): Promise<any>;
    remove(id: string): Promise<void>;
    inviteMember(projectId: string, dto: InviteMemberDto): Promise<import("../schemas/project.schema").Project>;
    updateMemberRole(projectId: string, userId: string, dto: UpdateMemberRoleDto): Promise<import("../schemas/project.schema").Project>;
    removeMember(projectId: string, userId: string): Promise<import("../schemas/project.schema").Project>;
    getUserRole(projectId: string, userId: string): Promise<ProjectRole | null>;
}
