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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskSchema = exports.Task = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const enums_1 = require("../../common/enums");
let Task = class Task extends mongoose_2.Document {
};
exports.Task = Task;
__decorate([
    (0, mongoose_1.Prop)({
        type: mongoose_2.Types.ObjectId,
        ref: 'Project',
        required: true,
        index: true,
    }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Task.prototype, "projectId", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: mongoose_2.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Task.prototype, "ownerId", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: Object.values(enums_1.Group),
        default: enums_1.Group.TODO,
        index: true,
    }),
    __metadata("design:type", String)
], Task.prototype, "group", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, trim: true }),
    __metadata("design:type", String)
], Task.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)({ trim: true }),
    __metadata("design:type", String)
], Task.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: Object.values(enums_1.TaskStatus),
        default: enums_1.TaskStatus.PLANNED,
    }),
    __metadata("design:type", String)
], Task.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: Object.values(enums_1.TaskPriority),
        default: enums_1.TaskPriority.MEDIUM,
    }),
    __metadata("design:type", String)
], Task.prototype, "priority", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: mongoose_2.Types.ObjectId,
        ref: 'User',
        required: true,
    }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Task.prototype, "reporter", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [{ type: mongoose_2.Types.ObjectId, ref: 'User' }],
        default: [],
    }),
    __metadata("design:type", Array)
], Task.prototype, "members", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [String],
        default: [],
    }),
    __metadata("design:type", Array)
], Task.prototype, "labels", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date }),
    __metadata("design:type", Date)
], Task.prototype, "dueDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date }),
    __metadata("design:type", Date)
], Task.prototype, "startDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, default: 0 }),
    __metadata("design:type", Number)
], Task.prototype, "order", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, default: 0 }),
    __metadata("design:type", Number)
], Task.prototype, "estimatedHours", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, default: 0 }),
    __metadata("design:type", Number)
], Task.prototype, "spentHours", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: mongoose_2.Types.ObjectId,
        ref: 'User',
        required: true,
    }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Task.prototype, "createdBy", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: mongoose_2.Types.ObjectId,
        ref: 'User',
    }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Task.prototype, "updatedBy", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [String],
        default: [],
    }),
    __metadata("design:type", Array)
], Task.prototype, "resources", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Task.prototype, "lead", void 0);
exports.Task = Task = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true, versionKey: false })
], Task);
exports.TaskSchema = mongoose_1.SchemaFactory.createForClass(Task);
exports.TaskSchema.index({ projectId: 1, group: 1, order: 1 });
exports.TaskSchema.index({ title: 'text', description: 'text' });
exports.TaskSchema.set('toJSON', {
    virtuals: true,
    transform: (_doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        return ret;
    },
});
//# sourceMappingURL=task.schema.js.map