import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Project } from '../schemas/project.schema';
import { CreateProjectDto } from '../dto/create-project.dto';
import { UpdateProjectDto } from '../dto/update-project.dto';

@Injectable()
export class ProjectRepository {
  constructor(@InjectModel(Project.name) private projectModel: Model<Project>) { }

  async create(data: Partial<Project>): Promise<Project> {
    const created = new this.projectModel(data);
    return created.save();
  }

  async findById(id: string | Types.ObjectId): Promise<Project | null> {
    return this.projectModel
      .findById(id)
      .populate('owner', 'username email avatar')
      .populate('members.user', 'username email avatar')
      .exec();
  }

  async findByIdLean(id: string | Types.ObjectId): Promise<any> {
    return this.projectModel.findById(id).lean().exec();
  }

  async findAll(
    filter: any,
    sort: any,
    skip: number,
    limit: number,
  ) {
    return this.projectModel.aggregate([
      {
        $match: filter,
      },

      // Find lead user
      {
        $lookup: {
          from: 'users',
          localField: 'lead',
          foreignField: '_id',
          as: 'lead',
        },
      },

      // Convert lead array into object
      {
        $unwind: {
          path: '$lead',
          preserveNullAndEmptyArrays: true,
        },
      },

      // Only return required user fields
      {
        $project: {
          title: 1,
          description: 1,
          owner: 1,
          priority: 1,
          status: 1,
          startDate: 1,
          dueDate: 1,
          createdAt: 1,
          updatedAt: 1,

          lead: {
            id: '$lead._id',
            username: '$lead.username',
            email: '$lead.email',
            avatar: '$lead.avatar',
          },
        },
      },

      {
        $sort: sort,
      },

      {
        $skip: skip,
      },

      {
        $limit: limit,
      },
    ]);
  }

  async count(filter: Record<string, any> = {}): Promise<number> {
    return this.projectModel.countDocuments(filter).exec();
  }

  async update(
    id: string,
    data: UpdateProjectDto,
  ): Promise<any | null> {
    try {
      const updateData: any = {};

      if (data.title !== undefined) {
        updateData.title = data.title;
      }

      if (data.description !== undefined) {
        updateData.description = data.description;
      }

      if (data.priority !== undefined) {
        updateData.priority = data.priority;
      }

      if (data.status !== undefined) {
        updateData.status = data.status;
      }

      if (data.lead !== undefined) {
        updateData.lead = new Types.ObjectId(data.lead);
      }


      if (data.dueDate !== undefined) {
        updateData.dueDate = new Date(data.dueDate);
      }

      const project = await this.projectModel
        .findByIdAndUpdate(
          id,
          { $set: updateData },
          {
            new: true,
            runValidators: true,
          },
        )
        .exec();

      if (!project) {
        return {
          success: false,
          statusCode: 404,
          message: 'Project not found',
          data: null,
        };
      }

      return {
        success: true,
        statusCode: 200,
        message: 'Project updated successfully',
        data: project,
      };


    } catch (error) {
      throw error;
    }
  }

  async addMember(
    id: string,
    userId: string,
    role: string,
  ): Promise<Project | null> {
    return this.projectModel
      .findByIdAndUpdate(
        id,
        { $addToSet: { members: { user: new Types.ObjectId(userId), role } } },
        { new: true },
      )
      .populate('members.user', 'username email avatar')
      .exec();
  }

  async updateMemberRole(
    id: string,
    userId: string,
    role: string,
  ): Promise<Project | null> {
    return this.projectModel
      .findOneAndUpdate(
        { _id: id, 'members.user': new Types.ObjectId(userId) },
        { $set: { 'members.$.role': role } },
        { new: true },
      )
      .populate('members.user', 'username email avatar')
      .exec();
  }

  async removeMember(id: string, userId: string): Promise<Project | null> {
    return this.projectModel
      .findByIdAndUpdate(
        id,
        { $pull: { members: { user: new Types.ObjectId(userId) } } },
        { new: true },
      )
      .populate('members.user', 'username email avatar')
      .exec();
  }

  async delete(id: string): Promise<void> {
    await this.projectModel.deleteOne({ _id: id }).exec();
  }

  async findByMember(userId: string): Promise<Project[]> {
    return this.projectModel
      .find({
        $or: [
          { owner: new Types.ObjectId(userId) },
          { 'members.user': new Types.ObjectId(userId) },
        ],
      })
      .exec();
  }
}
