import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SubtasksService } from '../services/subtasks.service';
import { CreateSubtaskDto } from '../dto/create-subtask.dto';
import { UpdateSubtaskDto } from '../dto/update-subtask.dto';
import { JwtAuthGuard, Auth, CurrentUser } from '../../common';

@ApiTags('Subtasks')
@Controller('tasks/:taskId/subtasks')
@UseGuards(JwtAuthGuard)
@Auth()
export class SubtasksController {
  constructor(private readonly subtasksService: SubtasksService) {}

  @Post()
  @ApiOperation({ summary: 'Create a subtask under a task' })
  @ApiResponse({ status: 201, description: 'Subtask created' })
  create(
    @Param('taskId') taskId: string,
    @Body() dto: CreateSubtaskDto,
    @CurrentUser() user: any,
  ) {
    return this.subtasksService.create(dto, taskId, user._id);
  }

  @Get()
  @ApiOperation({ summary: 'List subtasks for a task' })
  @ApiResponse({ status: 200, description: 'List of subtasks' })
  findAll(@Param('taskId') taskId: string) {
    return this.subtasksService.findByTaskId(taskId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a subtask' })
  @ApiResponse({ status: 200, description: 'Subtask updated' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateSubtaskDto,
    @CurrentUser() user: any,
  ) {
    return this.subtasksService.update(id, dto, user._id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a subtask' })
  @ApiResponse({ status: 204, description: 'Subtask deleted' })
  async remove(@Param('id') id: string, @CurrentUser() user: any) {
    await this.subtasksService.remove(id, user._id);
  }
}
