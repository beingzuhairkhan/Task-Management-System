import { ProjectPriority, ProjectStatus } from '../../common/enums';
export declare class PaginationDto {
    page?: number;
    limit?: number;
    search?: string;
    sort?: string;
    priority?: ProjectPriority;
    status?: ProjectStatus;
}
export interface PaginatedResult<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
