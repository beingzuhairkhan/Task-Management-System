import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, FilterQuery } from 'mongoose';
import { Task } from '../schemas/task.schema';
import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';
import { FilterTaskDto } from '../dto/filter-task.dto';
import { User } from 'src/users/schemas/user.schema';
import { Label } from 'src/labels/schemas/label.schema';
import { Subtask, } from 'src/subtasks/schemas/subtask.schema';

@Injectable()
export class TaskRepository {
  constructor(@InjectModel(Task.name) private taskModel: Model<Task>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Label.name) private labelModel: Model<Label>,
    @InjectModel(Subtask.name) private substaskModel: Model<Subtask>,

  ) { }

  async create(data: Partial<Task>): Promise<Task> {
    const created = new this.taskModel(data);
    return created.save();
  }

  async findById(id: string): Promise<any | null> {
    try {
      const taskId = new Types.ObjectId(id);

      const result = await this.taskModel.aggregate([
        {
          $match: {
            _id: taskId,
          },
        },

        // Reporter
        {
          $lookup: {
            from: "users",
            localField: "reporter",
            foreignField: "_id",
            as: "reporter",
          },
        },
        {
          $unwind: {
            path: "$reporter",
            preserveNullAndEmptyArrays: true,
          },
        },

        // Members
        {
          $lookup: {
            from: "users",
            localField: "members",
            foreignField: "_id",
            as: "members",
          },
        },

        // Subtasks
        {
          $lookup: {
            from: "subtasks",
            let: {
              taskId: "$_id",
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ["$taskId", "$$taskId"],
                  },
                },
              },

              {
                $sort: {
                  order: 1,
                },
              },

              // Get subtask member
              {
                $lookup: {
                  from: "users",
                  localField: "subMembers",
                  foreignField: "_id",
                  as: "subMember",
                },
              },

              // Convert lookup array into object
              {
                $unwind: {
                  path: "$subMember",
                  preserveNullAndEmptyArrays: true,
                },
              },

              {
                $project: {
                  _id: 1,
                  taskId: 1,
                  title: 1,
                  description: 1,
                  status: 1,
                  priority: 1,
                  dueDate: 1,
                  order: 1,
                  createdBy: 1,

                  subMember: {
                    id: "$subMember._id",
                    username: "$subMember.username",
                    avatar: "$subMember.avatar",
                  },
                },
              },
            ],
            as: "subtasks",
          },
        },

        // Final response
        {
          $project: {
            _id: 1,
            projectId: 1,
            ownerId: 1,
            group: 1,
            title: 1,
            description: 1,
            status: 1,
            priority: 1,
            dueDate: 1,
            order: 1,
            estimatedHours: 1,
            spentHours: 1,
            createdBy: 1,
            createdAt: 1,
            updatedAt: 1,
            labels: 1,
            resources: 1,

            reporter: {
              id: "$reporter._id",
              username: "$reporter.username",
              avatar: "$reporter.avatar",
              jobTitle: "$reporter.jobTitle",
            },

            members: {
              $map: {
                input: "$members",
                as: "member",
                in: {
                  id: "$$member._id",
                  username: "$$member.username",
                  avatar: "$$member.avatar",
                },
              },
            },

            subtasks: 1,
          },
        },
      ]);

      return result.length ? result[0] : null;
    } catch (err) {
      throw err;
    }
  }

  async findByIdLean(id: string): Promise<any> {
    return this.taskModel.findById(id).lean().exec();
  }

  async findAll(
    filter: FilterQuery<Task>,
    sort: Record<string, 1 | -1> = { order: 1 },
    skip = 0,
    limit = 20,
  ): Promise<Task[]> {
    const tasks = await this.taskModel
      .find(filter)
      .populate({
        path: 'members',
        model: 'User',
        select: 'username email avatar',
      })
      .populate({
        path: 'reporter',
        model: 'User',
        select: 'username email avatar',
      })
      .populate({
        path: 'ownerId',
        model: 'User',
        select: 'username email avatar',
      })
      .populate({
        path: 'lead',
        model: 'User',
        select: 'username email avatar',
      })
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .exec();



    return tasks;
  }

  async count(filter: FilterQuery<Task>): Promise<number> {
    return this.taskModel.countDocuments(filter).exec();
  }

  async update(
    id: string,
    data: UpdateTaskDto | Partial<Task>,
  ): Promise<Task | null> {
    return this.taskModel
      .findByIdAndUpdate(
        id,
        data,
        {
          new: true,
          runValidators: true,
        },
      )
      .populate('members', 'username email avatar')
      .populate('reporter', 'username email avatar')
      .exec();
  }

  async move(id: string, group: string): Promise<Task | null> {
    return this.taskModel
      .findByIdAndUpdate(
        id,
        { group },
        { new: true },
      )
      .exec();
  }

  // async addAssignee(id: string, userId: string): Promise<Task | null> {
  //   return this.taskModel
  //     .findByIdAndUpdate(
  //       id,
  //       { $addToSet: { assignees: new Types.ObjectId(userId) } },
  //       { new: true },
  //     )
  //     .populate('assignees', 'username email avatar')
  //     .exec();
  // }

  // async removeAssignee(id: string, userId: string): Promise<Task | null> {
  //   return this.taskModel
  //     .findByIdAndUpdate(
  //       id,
  //       { $pull: { assignees: new Types.ObjectId(userId) } },
  //       { new: true },
  //     )
  //     .populate('assignees', 'username email avatar')
  //     .exec();
  // }


  async delete(id: string): Promise<void> {
    await this.substaskModel
      .deleteMany({
        taskId: new Types.ObjectId(id),
      })
      .exec();

    await this.taskModel
      .deleteOne({
        _id: new Types.ObjectId(id),
      })
      .exec();
  }

  async findManyByProject(projectId: string): Promise<Task[]> {
    return this.taskModel.find({ projectId: new Types.ObjectId(projectId) }).exec();
  }

  buildFilter(
  projectId: string,
  filterDto: FilterTaskDto,
  search?: string,
  userId?: string,
  projectOwnerId?: Types.ObjectId,
  projectLeadId?: Types.ObjectId,
  subTaskTaskIds: Types.ObjectId[] = [],
): FilterQuery<Task> {
  const filter: FilterQuery<Task> = {
    projectId: new Types.ObjectId(projectId),
  };

  if (userId) {
    const userObjectId = new Types.ObjectId(userId);

    const isProjectOwner =
      projectOwnerId &&
      projectOwnerId.equals(userObjectId);

    const isProjectLead =
      projectLeadId &&
      projectLeadId.equals(userObjectId);

    // Project owner and project lead see ALL tasks
    if (!isProjectOwner && !isProjectLead) {
      filter.$or = [
        {
          reporter: userObjectId,
        },
        {
          lead: userObjectId,
        },
        {
          members: userObjectId,
        },

        // User is assigned to a subtask
        ...(subTaskTaskIds.length > 0
          ? [
              {
                _id: {
                  $in: subTaskTaskIds,
                },
              },
            ]
          : []),
      ];
    }
  }

  if (filterDto.status) {
    filter.status = filterDto.status;
  }

  if (filterDto.priority) {
    filter.priority = filterDto.priority;
  }

  if (filterDto.group) {
    filter.group = filterDto.group;
  }

  if (filterDto.members?.length) {
    filter.members = {
      $in: filterDto.members.map(
        (id) => new Types.ObjectId(id),
      ),
    };
  }

  if (search) {
    const accessFilter = filter.$or;

    delete filter.$or;

    filter.$and = [
      ...(accessFilter
        ? [
            {
              $or: accessFilter,
            },
          ]
        : []),

      {
        $or: [
          {
            title: {
              $regex: search,
              $options: "i",
            },
          },
          {
            description: {
              $regex: search,
              $options: "i",
            },
          },
        ],
      },
    ];
  }

  return filter;
}

}
