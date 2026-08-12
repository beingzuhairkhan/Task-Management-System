import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Comment } from '../schemas/comment.schema';
import { CreateCommentDto } from '../dto/create-comment.dto';
import { UpdateCommentDto } from '../dto/update-comment.dto';

@Injectable()
export class CommentRepository {
  constructor(@InjectModel(Comment.name) private commentModel: Model<Comment>) {}

async create(data: Partial<Comment>): Promise<Comment> {
  const created = new this.commentModel(data);

  await created.save();

  return created.populate(
    "userId",
    "username email avatar",
  );
}

  async findById(id: string): Promise<Comment | null> {
    return this.commentModel
      .findById(id)
      .populate('userId', 'username email avatar')
      .exec();
  }

  async findByTaskId(taskId: string): Promise<Comment[]> {
    return this.commentModel
      .find({ taskId: new Types.ObjectId(taskId) })
      .populate('userId', 'username email avatar')
      .sort({ createdAt: 1 })
      .exec();
  }

  async update(id: string, data: UpdateCommentDto): Promise<Comment | null> {
    return this.commentModel
      .findByIdAndUpdate(id, data, { new: true })
      .populate('userId', 'username email avatar')
      .exec();
  }

  async delete(id: string): Promise<void> {
    await this.commentModel.deleteOne({ _id: id }).exec();
  }
}
