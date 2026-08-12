import { Injectable } from '@nestjs/common';
import { ActivityRepository } from '../repositories/activity.repository';
import { ActivityAction } from '../../common/enums';
import { PaginationDto, PaginatedResult, paginateResult } from '../../common';

@Injectable()
export class ActivityService {
  constructor(private readonly activityRepository: ActivityRepository) { }

  async log(params: {
    taskId: string;
    userId: string;
    action: ActivityAction;
    oldValue?: string;
    newValue?: string;
  }) {
    return this.activityRepository.create({
      taskId: params.taskId as any,
      userId: params.userId as any,
      action: params.action,
      oldValue: params.oldValue,
      newValue: params.newValue,
    });
  }

  async findByTaskId(
    taskId: string,
    dto: PaginationDto,
  ): Promise<PaginatedResult<any>> {
    const all = await this.activityRepository.findByTaskIds([taskId]);

    const page = dto.page || 1;
    const limit = dto.limit || 5;

    const start = (page - 1) * limit;

    return paginateResult(
      all.slice(start, start + limit),
      all.length,
      dto,
    );
  }
}
