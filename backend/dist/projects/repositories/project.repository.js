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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectRepository = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const project_schema_1 = require("../schemas/project.schema");
const subtask_schema_1 = require("../../subtasks/schemas/subtask.schema");
const task_schema_1 = require("../../tasks/schemas/task.schema");
let ProjectRepository = class ProjectRepository {
    constructor(projectModel, substaskModel, taskModel) {
        this.projectModel = projectModel;
        this.substaskModel = substaskModel;
        this.taskModel = taskModel;
    }
    async create(data) {
        const created = new this.projectModel(data);
        return created.save();
    }
    async findById(id) {
        return this.projectModel
            .findById(id)
            .populate('owner', 'username email avatar')
            .populate('members.user', 'username email avatar')
            .exec();
    }
    async findByIdLean(id) {
        return this.projectModel.findById(id).lean().exec();
    }
    async findAll(filter, sort, skip, limit) {
        return this.projectModel.aggregate([
            {
                $match: filter,
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'lead',
                    foreignField: '_id',
                    as: 'lead',
                },
            },
            {
                $unwind: {
                    path: '$lead',
                    preserveNullAndEmptyArrays: true,
                },
            },
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
    async count(filter = {}) {
        return this.projectModel.countDocuments(filter).exec();
    }
    async update(id, data) {
        try {
            const updateData = {};
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
                updateData.lead = new mongoose_2.Types.ObjectId(data.lead);
            }
            if (data.dueDate !== undefined) {
                updateData.dueDate = new Date(data.dueDate);
            }
            const project = await this.projectModel
                .findByIdAndUpdate(id, { $set: updateData }, {
                new: true,
                runValidators: true,
            })
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
        }
        catch (error) {
            throw error;
        }
    }
    async delete(id) {
        const tasks = await this.taskModel
            .find({ projectId: new mongoose_2.Types.ObjectId(id) })
            .select('_id')
            .lean()
            .exec();
        const taskIds = tasks.map((task) => task._id);
        if (taskIds.length > 0) {
            await this.substaskModel.deleteMany({
                taskId: { $in: taskIds },
            }).exec();
        }
        await this.taskModel.deleteMany({
            projectId: new mongoose_2.Types.ObjectId(id),
        }).exec();
        await this.projectModel.deleteOne({
            _id: new mongoose_2.Types.ObjectId(id),
        }).exec();
    }
    async findByMember(userId) {
        return this.projectModel
            .find({
            $or: [
                { owner: new mongoose_2.Types.ObjectId(userId) },
                { 'members.user': new mongoose_2.Types.ObjectId(userId) },
            ],
        })
            .exec();
    }
};
exports.ProjectRepository = ProjectRepository;
exports.ProjectRepository = ProjectRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(project_schema_1.Project.name)),
    __param(1, (0, mongoose_1.InjectModel)(subtask_schema_1.Subtask.name)),
    __param(2, (0, mongoose_1.InjectModel)(task_schema_1.Task.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], ProjectRepository);
//# sourceMappingURL=project.repository.js.map