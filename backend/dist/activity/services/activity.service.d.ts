import { ActivityRepository } from '../repositories/activity.repository';
import { ActivityAction } from '../../common/enums';
import { PaginationDto, PaginatedResult } from '../../common';
export declare class ActivityService {
    private readonly activityRepository;
    constructor(activityRepository: ActivityRepository);
    log(params: {
        taskId: string;
        userId: string;
        action: ActivityAction;
        oldValue?: string;
        newValue?: string;
    }): Promise<import("../schemas/activity.schema").Activity>;
    findByTaskId(taskId: string, dto: PaginationDto): Promise<PaginatedResult<any>>;
}
