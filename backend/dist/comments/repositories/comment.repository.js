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
exports.CommentRepository = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const comment_schema_1 = require("../schemas/comment.schema");
let CommentRepository = class CommentRepository {
    constructor(commentModel) {
        this.commentModel = commentModel;
    }
    async create(data) {
        const created = new this.commentModel(data);
        await created.save();
        return created.populate("userId", "username email avatar");
    }
    async findById(id) {
        return this.commentModel
            .findById(id)
            .populate('userId', 'username email avatar')
            .exec();
    }
    async findByTaskId(taskId) {
        return this.commentModel
            .find({ taskId: new mongoose_2.Types.ObjectId(taskId) })
            .populate('userId', 'username email avatar')
            .sort({ createdAt: 1 })
            .exec();
    }
    async update(id, data) {
        return this.commentModel
            .findByIdAndUpdate(id, data, { new: true })
            .populate('userId', 'username email avatar')
            .exec();
    }
    async delete(id) {
        await this.commentModel.deleteOne({ _id: id }).exec();
    }
};
exports.CommentRepository = CommentRepository;
exports.CommentRepository = CommentRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(comment_schema_1.Comment.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], CommentRepository);
//# sourceMappingURL=comment.repository.js.map