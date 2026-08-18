import { HttpException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { ProjectRepository } from '../repositories/project.repository';
import { UserRepository } from '../../users/repositories/user.repository';
import { CreateProjectDto } from '../dto/create-project.dto';
import { UpdateProjectDto } from '../dto/update-project.dto';
import Groq from 'groq-sdk';
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
import { ConfigService } from '@nestjs/config';
@Injectable()
export class ProjectsService {
  private readonly logger = new Logger(ProjectsService.name);
  private readonly groq: Groq;
  constructor(
    private readonly projectRepository: ProjectRepository,
    private readonly userRepository: UserRepository,
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    @InjectModel(Subtask.name) private substaskModel: Model<Subtask>,
    @InjectModel(Task.name) private taskModel: Model<Task>,
    private readonly configService: ConfigService,
  ) {
    this.groq = new Groq({
      apiKey: this.configService.get<string>(
        'GROQ_API_KEY',
      ),
    });
  }

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

  async getUserRole(projectId: string, userId: string): Promise<ProjectRole | null> {
    const project = await this.projectRepository.findByIdLean(projectId);
    if (!project) return null;
    if (String(project.owner) === String(userId)) return ProjectRole.OWNER;
    const member = project.members.find(
      (m) => String(m.user) === String(userId),
    );
    return member ? (member.role as ProjectRole) : null;
  }

  async generateProjectDescription(
    title: string,
  ): Promise<string> {
    try {
      const completion =
        await this.groq.chat.completions.create({
          messages: [
            {
              role: 'system',
              content:
                'You generate short project descriptions. Return exactly 2 short sentences. Do not use bullet points, headings, or quotation marks.',
            },
            {
              role: 'user',
              content: `Create a professional 2-sentence description for this project: ${title}`,
            },
          ],
          model: 'openai/gpt-oss-20b',
          temperature: 0.7,
          reasoning_effort: "low",
          max_completion_tokens: 300,
        });
      console.log("Groq response:", completion);
      console.log(
        "GROQ CONTENT:",
        completion.choices?.[0]?.message?.content
      );

      return (
        completion.choices[0]?.message?.content?.trim() ||
        ''
      );
    } catch (error) {
      console.error(
        'Groq description generation failed:',
        error,
      );

      throw new InternalServerErrorException(
        'Failed to generate project description',
      );
    }
  }


}
