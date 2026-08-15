import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TasksService } from '../services/tasks.service';
import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';
import { MoveTaskDto } from '../dto/move-task.dto';
import { FilterTaskDto } from '../dto/filter-task.dto';
import { AssignTaskDto } from '../dto/assign-task.dto';
import {
  JwtAuthGuard,
  Auth,
  CurrentUser,
  PaginationDto,
} from '../../common';

@ApiTags('Tasks')
@Controller('projects/:projectId/tasks')
@UseGuards(JwtAuthGuard)
@Auth()
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @ApiOperation({ summary: 'Create a task in a project' })
  @ApiResponse({ status: 201, description: 'Task created' })
  create(
    @Param('projectId') projectId: string,
    @Body() dto: CreateTaskDto,
    @CurrentUser() user: any,
  ) {
    return this.tasksService.create(dto, projectId, user._id);
  }

  @Get()
  @ApiOperation({ summary: 'List tasks with filtering, search, pagination, sorting' })
  @ApiResponse({ status: 200, description: 'Paginated filtered tasks' })
  findAll(
    @Param('projectId') projectId: string,
    @Query() filterDto: FilterTaskDto,
    @Query() dto: PaginationDto,
    @CurrentUser() user: any,
  ) {
    return this.tasksService.findAll(projectId, filterDto, dto , user._id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a task by id' })
  @ApiResponse({ status: 200, description: 'Task details' })
  findOne(@Param('id') id: string) {
    return this.tasksService.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a task (assignees or creator only)' })
  @ApiResponse({ status: 200, description: 'Task updated' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateTaskDto,
    @CurrentUser() user: any,
  ) {
    return this.tasksService.update(id, dto, user._id);
  }

  @Patch(':id/move')
  @ApiOperation({ summary: 'Move task to another group and/or reorder (drag & drop)' })
  @ApiResponse({ status: 200, description: 'Task moved' })
  move(
    @Param('id') id: string,
    @Body() dto: MoveTaskDto,
    @CurrentUser() user: any,
  ) {
    return this.tasksService.move(id, dto, user._id);
  }

  @Post(':id/assign')
  @ApiOperation({ summary: 'Assign a user to a task' })
  @ApiResponse({ status: 200, description: 'User assigned' })
  assign(
    @Param('id') id: string,
    @Body() dto: AssignTaskDto,
    @CurrentUser() user: any,
  ) {
    return this.tasksService.assign(id, dto.userId, user._id);
  }

  @Delete(':id/assign/:userId')
  @ApiOperation({ summary: 'Remove an assignee from a task' })
  @ApiResponse({ status: 200, description: 'Assignee removed' })
  unassign(
    @Param('id') id: string,
    @Param('userId') userId: string,
    @CurrentUser() user: any,
  ) {
    return this.tasksService.unassign(id, userId, user._id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a task' })
  @ApiResponse({ status: 204, description: 'Task deleted' })
  async remove(@Param('id') id: string, @CurrentUser() user: any) {
    await this.tasksService.remove(id, user._id);
  }
}
