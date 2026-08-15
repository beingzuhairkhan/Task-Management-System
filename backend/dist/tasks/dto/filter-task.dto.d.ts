import { Group, TaskPriority, TaskStatus } from '../../common/enums';
export declare class FilterTaskDto {
    status?: TaskStatus;
    priority?: TaskPriority;
    group?: Group;
    members?: string[];
}
