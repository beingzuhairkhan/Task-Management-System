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
exports.TaskRepository = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const task_schema_1 = require("../schemas/task.schema");
const user_schema_1 = require("../../users/schemas/user.schema");
const label_schema_1 = require("../../labels/schemas/label.schema");
const subtask_schema_1 = require("../../subtasks/schemas/subtask.schema");
let TaskRepository = class TaskRepository {
    constructor(taskModel, userModel, labelModel, substaskModel) {
        this.taskModel = taskModel;
        this.userModel = userModel;
        this.labelModel = labelModel;
        this.substaskModel = substaskModel;
    }
    async create(data) {
        const created = new this.taskModel(data);
        return created.save();
    }
    async findById(id) {
        try {
            const taskId = new mongoose_2.Types.ObjectId(id);
            const result = await this.taskModel.aggregate([
                {
                    $match: {
                        _id: taskId,
                    },
                },
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
                {
                    $lookup: {
                        from: "users",
                        localField: "members",
                        foreignField: "_id",
                        as: "members",
                    },
                },
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
                            {
                                $lookup: {
                                    from: "users",
                                    localField: "subMembers",
                                    foreignField: "_id",
                                    as: "subMember",
                                },
                            },
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
        }
        catch (err) {
            throw err;
        }
    }
    async findByIdLean(id) {
        return this.taskModel.findById(id).lean().exec();
    }
    async findAll(filter, sort = { order: 1 }, skip = 0, limit = 20) {
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
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .exec();
        return tasks;
    }
    async count(filter) {
        return this.taskModel.countDocuments(filter).exec();
    }
    async update(id, data) {
        return this.taskModel
            .findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true,
        })
            .populate('members', 'username email avatar')
            .populate('reporter', 'username email avatar')
            .exec();
    }
    async move(id, group) {
        return this.taskModel
            .findByIdAndUpdate(id, { group }, { new: true })
            .exec();
    }
    async addAssignee(id, userId) {
        return this.taskModel
            .findByIdAndUpdate(id, { $addToSet: { assignees: new mongoose_2.Types.ObjectId(userId) } }, { new: true })
            .populate('assignees', 'username email avatar')
            .exec();
    }
    async removeAssignee(id, userId) {
        return this.taskModel
            .findByIdAndUpdate(id, { $pull: { assignees: new mongoose_2.Types.ObjectId(userId) } }, { new: true })
            .populate('assignees', 'username email avatar')
            .exec();
    }
    async delete(id) {
        await this.substaskModel
            .deleteMany({
            taskId: new mongoose_2.Types.ObjectId(id),
        })
            .exec();
        await this.taskModel
            .deleteOne({
            _id: new mongoose_2.Types.ObjectId(id),
        })
            .exec();
    }
    async findManyByProject(projectId) {
        return this.taskModel.find({ projectId: new mongoose_2.Types.ObjectId(projectId) }).exec();
    }
    buildFilter(projectId, filterDto, search) {
        const filter = {
            projectId: new mongoose_2.Types.ObjectId(projectId),
        };
        if (filterDto.status)
            filter.status = filterDto.status;
        if (filterDto.priority)
            filter.priority = filterDto.priority;
        if (filterDto.groupId)
            filter.groupId = new mongoose_2.Types.ObjectId(filterDto.groupId);
        if (filterDto.assigneeId)
            filter.assignees = new mongoose_2.Types.ObjectId(filterDto.assigneeId);
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
            ];
        }
        return filter;
    }
};
exports.TaskRepository = TaskRepository;
exports.TaskRepository = TaskRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(task_schema_1.Task.name)),
    __param(1, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __param(2, (0, mongoose_1.InjectModel)(label_schema_1.Label.name)),
    __param(3, (0, mongoose_1.InjectModel)(subtask_schema_1.Subtask.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], TaskRepository);
//# sourceMappingURL=task.repository.js.map