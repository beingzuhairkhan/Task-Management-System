"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var ProjectsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const project_repository_1 = require("../repositories/project.repository");
const user_repository_1 = require("../../users/repositories/user.repository");
const groq_sdk_1 = __importDefault(require("groq-sdk"));
const common_2 = require("../../common");
const enums_1 = require("../../common/enums");
const mongoose_2 = require("@nestjs/mongoose");
const user_schema_1 = require("../../users/schemas/user.schema");
const subtask_schema_1 = require("../../subtasks/schemas/subtask.schema");
const task_schema_1 = require("../../tasks/schemas/task.schema");
const config_1 = require("@nestjs/config");
let ProjectsService = ProjectsService_1 = class ProjectsService {
    constructor(projectRepository, userRepository, userModel, substaskModel, taskModel, configService) {
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
        this.userModel = userModel;
        this.substaskModel = substaskModel;
        this.taskModel = taskModel;
        this.configService = configService;
        this.logger = new common_1.Logger(ProjectsService_1.name);
        this.groq = new groq_sdk_1.default({
            apiKey: this.configService.get('GROQ_API_KEY'),
        });
    }
    async create(dto, userId) {
        try {
            const lead = await this.userRepository.findById(dto.lead);
            if (!lead) {
                throw new common_2.NotFoundException('Project lead not found');
            }
            return await this.projectRepository.create({
                title: dto.title,
                description: dto.description,
                owner: new mongoose_1.Types.ObjectId(userId),
                members: [
                    {
                        user: new mongoose_1.Types.ObjectId(userId),
                        role: enums_1.ProjectRole.MEMBER,
                    },
                ],
                priority: dto.priority ?? enums_1.ProjectPriority.MEDIUM,
                status: dto.status ?? enums_1.ProjectStatus.PLANNING,
                lead: new mongoose_1.Types.ObjectId(dto.lead),
                startDate: new Date(),
                dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
            });
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            this.logger.error(`Failed to create project for user ${userId}`, error);
            throw new common_1.InternalServerErrorException('Failed to create project');
        }
    }
    async findAll(dto, userId) {
        try {
            const userObjectId = new mongoose_1.Types.ObjectId(userId);
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
            const subtaskProjectIds = subtaskProjectResult[0]?.projectIds || [];
            const accessibleProjectIds = [
                ...taskProjectIds,
                ...subtaskProjectIds,
            ];
            const baseFilter = {
                $or: [
                    {
                        owner: userObjectId,
                    },
                    {
                        lead: userObjectId,
                    },
                    {
                        'members.user': userObjectId,
                    },
                    {
                        _id: {
                            $in: accessibleProjectIds,
                        },
                    },
                ],
            };
            const searchFilter = (0, common_2.buildSearchFilter)(dto.search, ['title', 'description']);
            const filters = [baseFilter];
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
            const filter = filters.length === 1
                ? baseFilter
                : {
                    $and: filters,
                };
            const sort = (0, common_2.buildSortOption)(dto.sort);
            const page = dto.page || 1;
            const limit = dto.limit || 20;
            const skip = (page - 1) * limit;
            const [projects, total] = await Promise.all([
                this.projectRepository.findAll(filter, sort, skip, limit),
                this.projectRepository.count(filter),
            ]);
            return (0, common_2.paginateResult)(projects, total, dto);
        }
        catch (err) {
            throw err;
        }
    }
    async findById(id) {
        const project = await this.projectRepository.findById(id);
        if (!project)
            throw new common_2.NotFoundException('Project', id);
        return project;
    }
    async findByIdAndLoad(id) {
        const project = await this.projectRepository.findByIdLean(id);
        if (!project)
            throw new common_2.NotFoundException('Project', id);
        return project;
    }
    async update(id, dto) {
        const project = await this.projectRepository.update(id, dto);
        if (!project)
            throw new common_2.NotFoundException('Project', id);
        return project;
    }
    async remove(id, userId) {
        try {
            const project = await this.projectRepository.findById(id);
            if (!project) {
                throw new common_2.NotFoundException('Project', id);
            }
            const isOwner = String(project.owner?._id ?? project.owner) === String(userId);
            const isLead = String(project.lead?._id ?? project.lead) === String(userId);
            if (!isOwner && !isLead) {
                throw new common_2.ForbiddenException('Only the project owner or lead can delete this project');
            }
            await this.projectRepository.delete(id);
        }
        catch (error) {
            console.error('Error deleting project:', error);
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('Failed to delete project');
        }
    }
    async getUserRole(projectId, userId) {
        const project = await this.projectRepository.findByIdLean(projectId);
        if (!project)
            return null;
        if (String(project.owner) === String(userId))
            return enums_1.ProjectRole.OWNER;
        const member = project.members.find((m) => String(m.user) === String(userId));
        return member ? member.role : null;
    }
    async generateProjectDescription(title) {
        try {
            const completion = await this.groq.chat.completions.create({
                messages: [
                    {
                        role: 'system',
                        content: 'You generate short project descriptions. Return exactly 2 short sentences. Do not use bullet points, headings, or quotation marks.',
                    },
                    {
                        role: 'user',
                        content: `Create a professional 2-sentence description for this project: ${title}`,
                    },
                ],
                model: 'llama-3.1-8b-instant',
                temperature: 0.7,
                max_tokens: 100,
            });
            return (completion.choices[0]?.message?.content?.trim() ||
                '');
        }
        catch (error) {
            console.error('Groq description generation failed:', error);
            throw new common_1.InternalServerErrorException('Failed to generate project description');
        }
    }
};
exports.ProjectsService = ProjectsService;
exports.ProjectsService = ProjectsService = ProjectsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, mongoose_2.InjectModel)(user_schema_1.User.name)),
    __param(3, (0, mongoose_2.InjectModel)(subtask_schema_1.Subtask.name)),
    __param(4, (0, mongoose_2.InjectModel)(task_schema_1.Task.name)),
    __metadata("design:paramtypes", [project_repository_1.ProjectRepository,
        user_repository_1.UserRepository,
        mongoose_1.Model,
        mongoose_1.Model,
        mongoose_1.Model,
        config_1.ConfigService])
], ProjectsService);
//# sourceMappingURL=projects.service.js.map