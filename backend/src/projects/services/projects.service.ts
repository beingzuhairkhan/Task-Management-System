import { HttpException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { ProjectRepository } from '../repositories/project.repository';
import { UserRepository } from '../../users/repositories/user.repository';
import { CreateProjectDto } from '../dto/create-project.dto';
import { UpdateProjectDto } from '../dto/update-project.dto';
import { InviteMemberDto } from '../dto/invite-member.dto';
import { UpdateMemberRoleDto } from '../dto/update-member-role.dto';
import {
  NotFoundException,
  ForbiddenException,
  ConflictException,
  PaginationDto,
  PaginatedResult,
  buildSearchFilter,
  buildSortOption,
  paginateResult,
} from '../../common';
import { ProjectRole, ProjectStatus, ProjectPriority } from '../../common/enums';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../../users/schemas/user.schema';
import { Subtask, } from 'src/subtasks/schemas/subtask.schema';
import { Task, TaskSchema } from 'src/tasks/schemas/task.schema';
@Injectable()
export class ProjectsService {
  private readonly logger = new Logger(ProjectsService.name);
  constructor(
    private readonly projectRepository: ProjectRepository,
    private readonly userRepository: UserRepository,
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
       @InjectModel(Subtask.name) private substaskModel: Model<Subtask>,
    @InjectModel(Task.name) private taskModel: Model<Task>
  ) { }

  async create(dto: CreateProjectDto, userId: string) {
    try {
      const lead = await this.userRepository.findById(dto.lead);

      if (!lead) {
        throw new NotFoundException('Project lead not found');
      }

      return await this.projectRepository.create({
        title: dto.title,
        description: dto.description,
        owner: new Types.ObjectId(userId),
        members: [
          {
            user: new Types.ObjectId(userId),
            role: ProjectRole.MEMBER,
          },
        ],
        priority: dto.priority ?? ProjectPriority.MEDIUM,
        status: dto.status ?? ProjectStatus.PLANNING,
        lead: new Types.ObjectId(dto.lead),
        startDate: new Date(),
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
      });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      this.logger.error(
        `Failed to create project for user ${userId}`,
        error,
      );

      throw new InternalServerErrorException(
        'Failed to create project',
      );
    }
  }


  async findAll(
  dto: PaginationDto,
  userId: string,
): Promise<PaginatedResult<any>> {
  try {
    const userObjectId = new Types.ObjectId(userId);

    const taskProjectIds = await this.taskModel.distinct('projectId', {
      $or: [
        { ownerId: userObjectId },
        { reporter: userObjectId },
        { members: userObjectId },
      ],
    });

    const subtaskProjectResult = await this.substaskModel.aggregate([
      {
        $match: {
          subMembers: userObjectId,
        },
      },

      {
        $lookup: {
          from: 'tasks',
          localField: 'taskId',
          foreignField: '_id',
          as: 'task',
        },
      },

      {
        $unwind: '$task',
      },

      {
        $group: {
          _id: null,
          projectIds: {
            $addToSet: '$task.projectId',
          },
        },
      },
    ]);

    const subtaskProjectIds =
      subtaskProjectResult[0]?.projectIds || [];


    const accessibleProjectIds = [
      ...taskProjectIds,
      ...subtaskProjectIds,
    ];

    const baseFilter = {
      $or: [
        // Project owner
        {
          owner: userObjectId,
        },

        // Project lead
        {
          lead: userObjectId,
        },

        // Project member
        {
          'members.user': userObjectId,
        },

        // User belongs to task/subtask
        {
          _id: {
            $in: accessibleProjectIds,
          },
        },
      ],
    };

    const searchFilter = buildSearchFilter(
      dto.search,
      ['title', 'description'],
    );

    const filters: any[] = [baseFilter];

    if (searchFilter.$or) {
      filters.push(searchFilter);
    }

    if (dto.priority) {
      filters.push({
        priority: dto.priority,
      });
    }


    if (dto.status) {
      filters.push({
        status: dto.status,
      });
    }

    const filter =
      filters.length === 1
        ? baseFilter
        : {
            $and: filters,
          };

    const sort = buildSortOption(dto.sort);

    const page = dto.page || 1;
    const limit = dto.limit || 20;
    const skip = (page - 1) * limit;

    const [projects, total] = await Promise.all([
      this.projectRepository.findAll(
        filter,
        sort,
        skip,
        limit,
      ),

      this.projectRepository.count(filter),
    ]);

    return paginateResult(projects, total, dto);
  } catch (err) {
    throw err;
  }
}

  async findById(id: string) {
    const project = await this.projectRepository.findById(id);
    if (!project) throw new NotFoundException('Project', id);
    return project;
  }

  async findByIdAndLoad(id: string) {
    const project = await this.projectRepository.findByIdLean(id);
    if (!project) throw new NotFoundException('Project', id);
    return project;
  }

  async update(id: string, dto: UpdateProjectDto) {
    const project = await this.projectRepository.update(id, dto);
    if (!project) throw new NotFoundException('Project', id);
    return project;
  }

  async remove(id: string, userId: string): Promise<void> {
    try {
      const project = await this.projectRepository.findById(id);

      if (!project) {
        throw new NotFoundException('Project', id);
      }


      const isOwner =
        String(project.owner?._id ?? project.owner) === String(userId);

      const isLead =
        String(project.lead?._id ?? project.lead) === String(userId);

      if (!isOwner && !isLead) {
        throw new ForbiddenException(
          'Only the project owner or lead can delete this project',
        );
      }

      await this.projectRepository.delete(id);
    } catch (error) {
      console.error('Error deleting project:', error);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException(
        'Failed to delete project',
      );
    }
  }

  // async inviteMember(projectId: string, dto: InviteMemberDto) {
  //   const project = await this.projectRepository.findById(projectId);
  //   if (!project) throw new NotFoundException('Project', projectId);

  //   const alreadyMember = project.members.some(
  //     (m) => String(m.user) === String(dto.userId),
  //   );
  //   if (alreadyMember) {
  //     throw new ConflictException('User is already a member of this project');
  //   }

  //   return this.projectRepository.addMember(projectId, dto.userId, dto.role);
  // }

  // async updateMemberRole(projectId: string, userId: string, dto: UpdateMemberRoleDto) {
  //   const project = await this.projectRepository.findById(projectId);
  //   if (!project) throw new NotFoundException('Project', projectId);

  //   const member = project.members.find((m) => String(m.user) === String(userId));
  //   if (!member) {
  //     throw new NotFoundException('Member', userId);
  //   }
  //   if (member.role === ProjectRole.OWNER) {
  //     throw new ForbiddenException('Cannot change the role of the project owner');
  //   }

  //   const updated = await this.projectRepository.updateMemberRole(
  //     projectId,
  //     userId,
  //     dto.role,
  //   );
  //   return updated;
  // }

  // async removeMember(projectId: string, userId: string) {
  //   const project = await this.projectRepository.findById(projectId);
  //   if (!project) throw new NotFoundException('Project', projectId);

  //   const member = project.members.find((m) => String(m.user) === String(userId));
  //   if (!member) throw new NotFoundException('Member', userId);
  //   if (member.role === ProjectRole.OWNER) {
  //     throw new ForbiddenException('Cannot remove the project owner');
  //   }

  //   return this.projectRepository.removeMember(projectId, userId);
  // }

  async getUserRole(projectId: string, userId: string): Promise<ProjectRole | null> {
    const project = await this.projectRepository.findByIdLean(projectId);
    if (!project) return null;
    if (String(project.owner) === String(userId)) return ProjectRole.OWNER;
    const member = project.members.find(
      (m) => String(m.user) === String(userId),
    );
    return member ? (member.role as ProjectRole) : null;
  }
}
