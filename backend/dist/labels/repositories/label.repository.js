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
exports.LabelRepository = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const label_schema_1 = require("../schemas/label.schema");
let LabelRepository = class LabelRepository {
    constructor(labelModel) {
        this.labelModel = labelModel;
    }
    async create(data) {
        const name = data.name?.trim();
        if (!name) {
            throw new Error("Label name is required");
        }
        const existing = await this.labelModel.findOne({
            name: {
                $regex: `^${name}$`,
                $options: "i",
            },
        });
        if (existing) {
            return existing;
        }
        const created = new this.labelModel({
            ...data,
            name,
        });
        return created.save();
    }
    async findAll() {
        return this.labelModel.find().sort({ name: 1 }).exec();
    }
    async findById(id) {
        return this.labelModel.findById(id).exec();
    }
    async findByProjectId(projectId) {
        return this.labelModel
            .find({ projectId: new mongoose_2.Types.ObjectId(projectId) })
            .sort({ name: 1 })
            .exec();
    }
    async update(id, data) {
        return this.labelModel.findByIdAndUpdate(id, data, { new: true }).exec();
    }
    async delete(id) {
        await this.labelModel.deleteOne({ _id: id }).exec();
    }
};
exports.LabelRepository = LabelRepository;
exports.LabelRepository = LabelRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(label_schema_1.Label.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], LabelRepository);
//# sourceMappingURL=label.repository.js.map