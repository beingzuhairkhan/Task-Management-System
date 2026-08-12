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
let ProjectRepository = class ProjectRepository {
    constructor(projectModel) {
        this.projectModel = projectModel;
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
    async addMember(id, userId, role) {
        return this.projectModel
            .findByIdAndUpdate(id, { $addToSet: { members: { user: new mongoose_2.Types.ObjectId(userId), role } } }, { new: true })
            .populate('members.user', 'username email avatar')
            .exec();
    }
    async updateMemberRole(id, userId, role) {
        return this.projectModel
            .findOneAndUpdate({ _id: id, 'members.user': new mongoose_2.Types.ObjectId(userId) }, { $set: { 'members.$.role': role } }, { new: true })
            .populate('members.user', 'username email avatar')
            .exec();
    }
    async removeMember(id, userId) {
        return this.projectModel
            .findByIdAndUpdate(id, { $pull: { members: { user: new mongoose_2.Types.ObjectId(userId) } } }, { new: true })
            .populate('members.user', 'username email avatar')
            .exec();
    }
    async delete(id) {
        await this.projectModel.deleteOne({ _id: id }).exec();
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
    __metadata("design:paramtypes", [mongoose_2.Model])
], ProjectRepository);
//# sourceMappingURL=project.repository.js.map