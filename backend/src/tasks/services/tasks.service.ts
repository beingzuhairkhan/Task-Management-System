import { BadRequestException, HttpException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { Types } from 'mongoose';
import { TaskRepository } from '../repositories/task.repository';
import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';
import { MoveTaskDto } from '../dto/move-task.dto';
import { FilterTaskDto } from '../dto/filter-task.dto';
import { ActivityService } from '../../activity/services/activity.service';
import {
  NotFoundException,
  ForbiddenException,
  PaginationDto,
  PaginatedResult,
  buildSortOption,
  paginateResult,
} from '../../common';
import { ActivityAction, TaskStatus, TaskPriority } from '../../common/enums';
import { Task } from '../schemas/task.schema';

@Injectable()
export class TasksService {
  constructor(
    private readonly taskRepository: TaskRepository,
    private readonly activityService: ActivityService,
  ) { }

  async create(dto: CreateTaskDto, projectId: string, userId: string) {
    try {
      const task = await this.taskRepository.create({
        ...dto,
        projectId: new Types.ObjectId(projectId),
        ownerId: new Types.ObjectId(userId),
        reporter: new Types.ObjectId(dto.reporter),
        createdBy: new Types.ObjectId(userId),
        members: (dto.members || []).map((id) => new Types.ObjectId(id)),
        labels: dto.labels || [],
        status: dto.status || TaskStatus.PLANNED,
        priority: dto.priority || TaskPriority.MEDIUM,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
        startDate: dto.startDate ? new Date(dto.startDate) : undefined,
      });

      await this.activityService.log({
        taskId: String(task._id),
        userId,
        action: ActivityAction.CREATED,
      });
      return task;
    } catch (err) {
      throw err;
    }

  }

  async findAll(
    projectId: string,
    filterDto: FilterTaskDto,
    dto: PaginationDto,
  ): Promise<PaginatedResult<any>> {
    const filter = this.taskRepository.buildFilter(
      projectId,
      filterDto,
      dto.search,
    );
    const sort = buildSortOption(dto.sort);
    const page = dto.page || 1;
    const limit = dto.limit || 20;
    const skip = (page - 1) * limit;

    const [tasks, total] = await Promise.all([
      this.taskRepository.findAll(filter, sort, skip, limit),
      this.taskRepository.count(filter),
    ]);
    return paginateResult(tasks, total, dto);
  }

  async findById(id: string) {
    const task = await this.taskRepository.findById(id);
    if (!task) throw new NotFoundException('Task', id);
    return task;
  }



  async update(id: string, dto: UpdateTaskDto, userId: string) {
    try {
      const existing = await this.taskRepository.findByIdLean(id);

      if (!existing) {
        throw new NotFoundException('Task', id);
      }

      // Permission check
      const isMember = existing.members.some(
        (m) => String(m) === String(userId),
      );

      const isCreator = String(existing.ownerId) === String(userId);
      const isReporter = String(existing.reporter) === String(userId);

      if (!isMember && !isCreator && !isReporter) {
        throw new ForbiddenException(
          'Only members, the task creator, or the reporter can update this task',
        );
      }

      // Log title change
      if (dto.title !== undefined && dto.title !== existing.title) {
        await this.activityService.log({
          taskId: id,
          userId,
          action: ActivityAction.UPDATED,
          oldValue: existing.title,
          newValue: dto.title,
        });
      }

      // Log description change
      if (
        dto.description !== undefined &&
        dto.description !== existing.description
      ) {
        await this.activityService.log({
          taskId: id,
          userId,
          action: ActivityAction.UPDATED,
          oldValue: existing.description || '',
          newValue: dto.description,
        });
      }

      // Log reporter change
      if (
        dto.reporter !== undefined &&
        String(dto.reporter) !== String(existing.reporter)
      ) {
        await this.activityService.log({
          taskId: id,
          userId,
          action: ActivityAction.UPDATED,
          oldValue: String(existing.reporter),
          newValue: String(dto.reporter),
        });
      }

      // Log status change
      if (dto.status !== undefined && dto.status !== existing.status) {
        await this.activityService.log({
          taskId: id,
          userId,
          action: ActivityAction.STATUS_CHANGED,
          oldValue: existing.status,
          newValue: dto.status,
        });
      }

      // Log priority change
      if (dto.priority !== undefined && dto.priority !== existing.priority) {
        await this.activityService.log({
          taskId: id,
          userId,
          action: ActivityAction.PRIORITY_CHANGED,
          oldValue: existing.priority,
          newValue: dto.priority,
        });
      }

      // Log group movement
      if (dto.group !== undefined && dto.group !== existing.group) {
        await this.activityService.log({
          taskId: id,
          userId,
          action: ActivityAction.MOVED,
          oldValue: `group:${existing.group}, order:${existing.order}`,
          newValue: `group:${dto.group}, order:${existing.order}`,
        });
      }

      const updateData: Partial<Task> & {
        updatedBy?: Types.ObjectId;
      } = {
        updatedBy: new Types.ObjectId(userId),
      };

      if (dto.title !== undefined) {
        updateData.title = dto.title;
      }

      if (dto.description !== undefined) {
        updateData.description = dto.description;
      }

      if (dto.reporter !== undefined) {
        updateData.reporter = new Types.ObjectId(dto.reporter);
      }

      if (dto.status !== undefined) {
        updateData.status = dto.status;
      }

      if (dto.group !== undefined) {
        updateData.group = dto.group;
      }

      if (dto.priority !== undefined) {
        updateData.priority = dto.priority;
      }

      if (dto.members !== undefined) {
        updateData.members = dto.members.map(
          (memberId) => new Types.ObjectId(memberId),
        );
      }

      if (dto.labels !== undefined) {
        updateData.labels = dto.labels;
      }

      if (dto.resources !== undefined) {
        updateData.resources = dto.resources;
      }

      const task = await this.taskRepository.update(id, updateData);

      await this.activityService.log({
        taskId: id,
        userId,
        action: ActivityAction.UPDATED,
      });

      return task;
    } catch (err) {
      throw err;
    }
  }

  async move(id: string, dto: MoveTaskDto, userId: string) {
    try {
      const existing = await this.taskRepository.findByIdLean(id);

      if (!existing) {
        throw new NotFoundException("Task", id);
      }

      const oldGroup = String(existing.groupId);
      const oldOrder = existing.order;
      const newGroup = String(dto.groupId);

      if (oldGroup === newGroup) {
        throw new BadRequestException(
          "Task is already in this group",
        );
      }

      const task = await this.taskRepository.move(
        id,
        dto.groupId,
      );

      await this.activityService.log({
        taskId: id,
        userId,
        action: ActivityAction.MOVED,
        oldValue: `group:${oldGroup}, order:${oldOrder}`,
      });

      return task;
    } catch (error) {
      console.error("MOVE TASK ERROR:", error);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException(
        error instanceof Error ? error.message : "Failed to move task",
      );
    }
  }
  async assign(id: string, userId: string, assignerId: string) {
    const existing = await this.taskRepository.findByIdLean(id);
    if (!existing) throw new NotFoundException('Task', id);

    const task = await this.taskRepository.addAssignee(id, userId);
    await this.activityService.log({
      taskId: id,
      userId: assignerId,
      action: ActivityAction.ASSIGNED,
      newValue: userId,
    });
    return task;
  }

  async unassign(id: string, userId: string, unassignerId: string) {
    const existing = await this.taskRepository.findByIdLean(id);
    if (!existing) throw new NotFoundException('Task', id);

    const task = await this.taskRepository.removeAssignee(id, userId);
    await this.activityService.log({
      taskId: id,
      userId: unassignerId,
      action: ActivityAction.UNASSIGNED,
      oldValue: userId,
    });
    return task;
  }

  async remove(id: string, userId: string): Promise<void> {
    try {

      const existing = await this.taskRepository.findById(id);

      if (!existing) {
        throw new NotFoundException('Task', id);
      }


      // Permission check
      const isMember = existing.members.some(
        (m) => String(m) === String(userId),
      );

      const isCreator = String(existing.ownerId) === String(userId);
      const isReporter = String(existing.reporter) === String(userId);


      if (!isMember && !isCreator && !isReporter) {

        throw new ForbiddenException(
          'Only members, the task creator, or the reporter can delete this task',
        );
      }

      await this.activityService.log({
        taskId: id,
        userId,
        action: ActivityAction.DELETED,
      });

      await this.taskRepository.delete(id);

    } catch (error) {

      if (error instanceof NotFoundException) {
        throw error;
      }

      if (error instanceof ForbiddenException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Failed to delete task',
      );
    }
  }
}
