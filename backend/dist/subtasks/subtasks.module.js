"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubtasksModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const subtask_schema_1 = require("./schemas/subtask.schema");
const subtask_repository_1 = require("./repositories/subtask.repository");
const subtasks_service_1 = require("./services/subtasks.service");
const subtasks_controller_1 = require("./controllers/subtasks.controller");
const activity_module_1 = require("../activity/activity.module");
const user_schema_1 = require("../users/schemas/user.schema");
const task_schema_1 = require("../tasks/schemas/task.schema");
let SubtasksModule = class SubtasksModule {
};
exports.SubtasksModule = SubtasksModule;
exports.SubtasksModule = SubtasksModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: 'Subtask', schema: subtask_schema_1.SubtaskSchema },
                {
                    name: user_schema_1.User.name,
                    schema: user_schema_1.UserSchema,
                },
                {
                    name: task_schema_1.Task.name,
                    schema: task_schema_1.TaskSchema,
                },
            ]),
            activity_module_1.ActivityModule,
        ],
        controllers: [subtasks_controller_1.SubtasksController],
        providers: [subtasks_service_1.SubtasksService, subtask_repository_1.SubtaskRepository],
        exports: [subtasks_service_1.SubtasksService, subtask_repository_1.SubtaskRepository, mongoose_1.MongooseModule],
    })
], SubtasksModule);
//# sourceMappingURL=subtasks.module.js.map