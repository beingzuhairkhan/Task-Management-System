import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ActivityService } from '../services/activity.service';
import { JwtAuthGuard, Auth, PaginationDto } from '../../common';

@ApiTags('Activity')
@Controller('tasks/:taskId/activity')
@UseGuards(JwtAuthGuard)
@Auth()
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Get()
  @ApiOperation({ summary: 'Get activity log for a task' })
  @ApiResponse({ status: 200, description: 'Activity log (paginated)' })
  findByTask(@Param('taskId') taskId: string, @Query() dto: PaginationDto) {
    return this.activityService.findByTaskId(taskId, dto);
  }
}
