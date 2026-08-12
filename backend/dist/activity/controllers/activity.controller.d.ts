import { ActivityService } from '../services/activity.service';
import { PaginationDto } from '../../common';
export declare class ActivityController {
    private readonly activityService;
    constructor(activityService: ActivityService);
    findByTask(taskId: string, dto: PaginationDto): Promise<import("../../common").PaginatedResult<any>>;
}
