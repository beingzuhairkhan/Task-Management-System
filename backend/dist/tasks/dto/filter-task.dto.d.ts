import { TaskPriority, TaskStatus } from '../../common/enums';
export declare class FilterTaskDto {
    status?: TaskStatus;
    priority?: TaskPriority;
    groupId?: string;
    assigneeId?: string;
}
