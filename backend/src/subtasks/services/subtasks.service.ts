import {
  Injectable,
} from '@nestjs/common';

import { Types } from 'mongoose';

import { SubtaskRepository } from '../repositories/subtask.repository';
import { CreateSubtaskDto } from '../dto/create-subtask.dto';
import { UpdateSubtaskDto } from '../dto/update-subtask.dto';

import { ActivityService } from '../../activity/services/activity.service';

import { NotFoundException } from '../../common';

import {
  ProjectStatus,
  TaskPriority,
  ActivityAction,
} from '../../common/enums';

@Injectable()
export class SubtasksService {
  constructor(
    private readonly subtaskRepository: SubtaskRepository,

    private readonly activityService: ActivityService,
  ) {}

  
  async create(
    dto: CreateSubtaskDto,
    taskId: string,
    userId: string,
  ) {
    const subtask =
      await this.subtaskRepository.create(
        {
          ...dto,

          taskId:
            new Types.ObjectId(taskId),

          createdBy:
            new Types.ObjectId(userId),

          subMembers: dto.subMembers
            ? new Types.ObjectId(
                dto.subMembers,
              )
            : undefined,

          status:
            dto.status ||
            ProjectStatus.PLANNING,

          priority:
            dto.priority ||
            TaskPriority.MEDIUM,

          dueDate: dto.dueDate
            ? new Date(dto.dueDate)
            : undefined,
        },

        // IMPORTANT
        taskId,

        // IMPORTANT
        userId,
      );

    await this.activityService.log({
      taskId,
      userId,

      action:
        ActivityAction.CREATED,

      newValue:
        `Subtask: ${subtask.title}`,
    });

    return subtask;
  }

  async findByTaskId(
    taskId: string,
  ) {
    return this.subtaskRepository
      .findByTaskId(taskId);
  }

  async findById(id: string) {
    const subtask =
      await this.subtaskRepository
        .findById(id);

    if (!subtask) {
      throw new NotFoundException(
        'Subtask',
        id,
      );
    }

    return subtask;
  }

  async update(
        id: string,
        dto: UpdateSubtaskDto,
        userId: string,
    ) {

        const subtask =
            await this.subtaskRepository.update(
                id,
                dto,
                userId,
            );


        if (!subtask) {
            throw new NotFoundException(
                'Subtask',
                id,
            );
        }



        const changes = Object.entries(dto)
            .filter(
                ([, value]) =>
                    value !== undefined &&
                    value !== null,
            )
            .map(
                ([key, value]) =>
                    `${key}: ${value}`,
            )
            .join(', ')


        await this.activityService.log({
            taskId: String(subtask.taskId),
            userId,
            action: ActivityAction.STATUS_CHANGED,
            newValue:
                changes ||
                `Subtask: ${subtask.title}`,
        });


        return subtask;
    }


  async remove(
    id: string,
    userId: string,
  ): Promise<void> {
    const subtask =
      await this.subtaskRepository
        .findById(id);

    if (!subtask) {
      throw new NotFoundException(
        'Subtask',
        id,
      );
    }

    await this.subtaskRepository.delete(
      id,
      userId,
    );

    await this.activityService.log({
      taskId: String(
        subtask.taskId,
      ),
      userId,
      action:
        ActivityAction.DELETED,
      newValue:
        `Subtask: ${subtask.title}`,
    });
  }
}