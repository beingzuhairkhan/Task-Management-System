import { TaskPriority, TaskStatus, Group } from '../../common/enums';
export declare class CreateTaskDto {
    title: string;
    description?: string;
    ownerId?: string;
    group?: Group;
    status?: TaskStatus;
    priority?: TaskPriority;
    members?: string[];
    labels?: string[];
    reporter: string;
    dueDate?: string;
    startDate?: string;
    estimatedHours?: number;
    spentHours?: number;
    resources?: string[];
}
