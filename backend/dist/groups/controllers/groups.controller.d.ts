import { GroupsService } from '../services/groups.service';
import { CreateGroupDto } from '../dto/create-group.dto';
import { UpdateGroupDto } from '../dto/update-group.dto';
import { ReorderGroupDto } from '../dto/reorder-group.dto';
export declare class GroupsController {
    private readonly groupsService;
    constructor(groupsService: GroupsService);
    create(projectId: string, dto: CreateGroupDto): Promise<import("../schemas/group.schema").Group>;
    findAll(projectId: string): Promise<import("../schemas/group.schema").Group[]>;
    reorder(projectId: string, items: ReorderGroupDto[]): Promise<import("../schemas/group.schema").Group[]>;
    update(id: string, dto: UpdateGroupDto): Promise<import("../schemas/group.schema").Group>;
    remove(id: string): Promise<void>;
}
