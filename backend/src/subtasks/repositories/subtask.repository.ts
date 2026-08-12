import {
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { Subtask } from '../schemas/subtask.schema';
import { UpdateSubtaskDto } from '../dto/update-subtask.dto';
import { User } from 'src/users/schemas/user.schema';
import { Task } from 'src/tasks/schemas/task.schema';

@Injectable()
export class SubtaskRepository {
  constructor(
    @InjectModel(Subtask.name)
    private readonly subtaskModel: Model<Subtask>,

    @InjectModel(User.name)
    private readonly userModel: Model<User>,

    @InjectModel(Task.name)
    private readonly taskModel: Model<Task>,
  ) {}


  async canAccessTask(
    taskId: string,
    userId: string,
  ): Promise<boolean> {
    const task = await this.taskModel.findById(taskId);

    if (!task) {
      throw new Error('Parent task not found');
    }

    const isTaskOwner =
      String(task.ownerId) === String(userId);

    const isTaskMember =
      Array.isArray(task.members) &&
      task.members.some(
        (member) =>
          String(member) === String(userId),
      );

    const isTaskReporter =
      String(task.reporter) === String(userId);

    return (
      isTaskOwner ||
      isTaskMember ||
      isTaskReporter
    );
  }


  async allRoleAccess(
    subtaskId: string,
    userId: string,
  ): Promise<boolean> {
    const subtask =
      await this.subtaskModel.findById(subtaskId);

    if (!subtask) {
      throw new Error('Subtask not found');
    }

    const task =
      await this.taskModel.findById(
        subtask.taskId,
      );

    if (!task) {
      throw new Error('Parent task not found');
    }


    const isTaskOwner =
      String(task.ownerId) === String(userId);

    const isTaskMember =
      Array.isArray(task.members) &&
      task.members.some(
        (member) =>
          String(member) === String(userId),
      );

    const isTaskReporter =
      String(task.reporter) === String(userId);


    const isSubtaskMember =
      Array.isArray(subtask.subMembers) &&
      subtask.subMembers.some(
        (member) =>
          String(member) === String(userId),
      );

    const isSubtaskCreator =
      String(subtask.createdBy) ===
      String(userId);

    return (
      isTaskOwner ||
      isTaskMember ||
      isTaskReporter ||
      isSubtaskMember ||
      isSubtaskCreator
    );
  }


  async create(
    data: Partial<Subtask>,
    taskId: string,
    userId: string,
  ): Promise<Subtask> {
    const canAccess =
      await this.canAccessTask(
        taskId,
        userId,
      );

    if (!canAccess) {
      throw new ForbiddenException(
        'Only the task owner, task members, or task reporter can create a subtask',
      );
    }

    const created =
      new this.subtaskModel(data);

    return created.save();
  }


  async findById(
    id: string,
  ): Promise<Subtask | null> {
    return this.subtaskModel
      .findById(id)
      .populate(
        'subMembers',
        'username email avatar',
      )
      .exec();
  }

  async findByTaskId(
    taskId: string,
  ): Promise<Subtask[]> {
    return this.subtaskModel
      .find({
        taskId: new Types.ObjectId(taskId),
      })
      .populate(
        'subMembers',
        'username email avatar',
      )
      .sort({ order: 1 })
      .exec();
  }


  async update(
    id: string,
    data: UpdateSubtaskDto,
    userId: string,
  ): Promise<Subtask | null> {
    const canAccess =
      await this.allRoleAccess(
        id,
        userId,
      );

    if (!canAccess) {
      throw new ForbiddenException(
        'Only the task owner, task members, task reporter, subtask members, or subtask creator can update this subtask',
      );
    }

    return this.subtaskModel
      .findByIdAndUpdate(
        id,
        data,
        {
          new: true,
        },
      )
      .populate(
        'subMembers',
        'username email avatar',
      )
      .exec();
  }


  async delete(
    id: string,
    userId: string,
  ): Promise<void> {
    const canAccess =
      await this.allRoleAccess(
        id,
        userId,
      );

    if (!canAccess) {
      throw new ForbiddenException(
        'Only the task owner, task members, task reporter, subtask members, or subtask creator can delete this subtask',
      );
    }

    await this.subtaskModel.findByIdAndDelete(id);
  }
}