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
var ActivityRepository_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivityRepository = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const activity_schema_1 = require("../schemas/activity.schema");
let ActivityRepository = ActivityRepository_1 = class ActivityRepository {
    constructor(activityModel) {
        this.activityModel = activityModel;
        this.logger = new common_1.Logger(ActivityRepository_1.name);
    }
    async create(data) {
        try {
            const created = new this.activityModel({
                ...data,
                taskId: data.taskId ? new mongoose_2.Types.ObjectId(String(data.taskId)) : undefined,
                userId: data.userId ? new mongoose_2.Types.ObjectId(String(data.userId)) : undefined,
            });
            return await created.save();
        }
        catch (err) {
            this.logger.error(`Failed to log activity: ${err.message}`);
            return null;
        }
    }
    async findByTaskIds(taskIds) {
        const result = await this.activityModel
            .find({
            taskId: {
                $in: taskIds.map((id) => new mongoose_2.Types.ObjectId(id)),
            },
            action: {
                $ne: 'UPDATED',
            },
        })
            .populate('userId', 'username email avatar')
            .sort({ createdAt: -1 })
            .limit(5)
            .exec();
        return result;
    }
};
exports.ActivityRepository = ActivityRepository;
exports.ActivityRepository = ActivityRepository = ActivityRepository_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(activity_schema_1.Activity.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], ActivityRepository);
//# sourceMappingURL=activity.repository.js.map