import { Model } from 'mongoose';
import { Group } from '../schemas/group.schema';
import { UpdateGroupDto } from '../dto/update-group.dto';
export declare class GroupRepository {
    private groupModel;
    constructor(groupModel: Model<Group>);
    create(data: Partial<Group>): Promise<Group>;
    findById(id: string): Promise<Group | null>;
    findByProjectId(projectId: string): Promise<Group[]>;
    update(id: string, data: UpdateGroupDto): Promise<Group | null>;
    updateOrder(id: string, order: number): Promise<void>;
    delete(id: string): Promise<void>;
}
