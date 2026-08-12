import { GroupRepository } from '../repositories/group.repository';
import { CreateGroupDto } from '../dto/create-group.dto';
import { UpdateGroupDto } from '../dto/update-group.dto';
import { ReorderGroupDto } from '../dto/reorder-group.dto';
export declare class GroupsService {
    private readonly groupRepository;
    constructor(groupRepository: GroupRepository);
    create(dto: CreateGroupDto, projectId: string): Promise<import("../schemas/group.schema").Group>;
    findByProjectId(projectId: string): Promise<import("../schemas/group.schema").Group[]>;
    findById(id: string): Promise<import("../schemas/group.schema").Group>;
    update(id: string, dto: UpdateGroupDto): Promise<import("../schemas/group.schema").Group>;
    reorder(projectId: string, items: ReorderGroupDto[]): Promise<import("../schemas/group.schema").Group[]>;
    remove(id: string): Promise<void>;
}
