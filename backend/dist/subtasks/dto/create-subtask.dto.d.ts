import { ProjectStatus, TaskPriority } from '../../common/enums';
export declare class CreateSubtaskDto {
    title: string;
    description?: string;
    status?: ProjectStatus;
    priority?: TaskPriority;
    subMembers?: string;
    dueDate?: string;
    order?: number;
}
