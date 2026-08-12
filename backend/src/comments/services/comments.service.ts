import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { CommentRepository } from '../repositories/comment.repository';
import { CreateCommentDto } from '../dto/create-comment.dto';
import { UpdateCommentDto } from '../dto/update-comment.dto';
import { ActivityService } from '../../activity/services/activity.service';
import { NotFoundException, ForbiddenException } from '../../common';
import { ActivityAction } from '../../common/enums';

@Injectable()
export class CommentsService {
  constructor(
    private readonly commentRepository: CommentRepository,
    private readonly activityService: ActivityService,
  ) {}

  async create(dto: CreateCommentDto, taskId: string, userId: string) {
    const comment = await this.commentRepository.create({
      ...dto,
      taskId: new Types.ObjectId(taskId),
      userId: new Types.ObjectId(userId),
    });

    await this.activityService.log({
      taskId,
      userId,
      action: ActivityAction.COMMENTED,
      newValue: dto.message,
    });
    return comment;
  }

  async findByTaskId(taskId: string) {
    return this.commentRepository.findByTaskId(taskId);
  }

  async update(id: string, dto: UpdateCommentDto, userId: string) {
    const comment = await this.commentRepository.findById(id);
    if (!comment) throw new NotFoundException('Comment', id);
    if (String(comment.userId) !== String(userId)) {
      throw new ForbiddenException('You can only edit your own comments');
    }
    return this.commentRepository.update(id, dto);
  }

  async remove(id: string, userId: string): Promise<void> {
    const comment = await this.commentRepository.findById(id);
    if (!comment) throw new NotFoundException('Comment', id);
    

    if (String(comment.userId._id) !== String(userId)) {
      throw new ForbiddenException('You can only delete your own comments');
    }
    await this.commentRepository.delete(id);
      await this.activityService.log({
    taskId: String(comment.taskId),
    userId,
    action: ActivityAction.COMMENT_DELETED,
    oldValue: comment.message,
  });
  }
}
