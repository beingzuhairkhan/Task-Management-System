import { ProjectPriority, ProjectStatus } from '../../common/enums';
export declare class CreateProjectDto {
    title: string;
    description: string;
    priority: ProjectPriority;
    status: ProjectStatus;
    lead: string;
    startDate?: string;
    dueDate: string;
}
