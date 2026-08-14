"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectsModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const project_schema_1 = require("./schemas/project.schema");
const project_repository_1 = require("./repositories/project.repository");
const projects_service_1 = require("./services/projects.service");
const projects_controller_1 = require("./controllers/projects.controller");
const project_middleware_1 = require("./middleware/project.middleware");
const users_module_1 = require("../users/users.module");
const subtask_schema_1 = require("../subtasks/schemas/subtask.schema");
const task_schema_1 = require("../tasks/schemas/task.schema");
let ProjectsModule = class ProjectsModule {
};
exports.ProjectsModule = ProjectsModule;
exports.ProjectsModule = ProjectsModule = __decorate([
    (0, common_1.Module)({
        imports: [mongoose_1.MongooseModule.forFeature([{ name: 'Project', schema: project_schema_1.ProjectSchema },
                {
                    name: task_schema_1.Task.name,
                    schema: task_schema_1.TaskSchema,
                },
                {
                    name: subtask_schema_1.Subtask.name,
                    schema: subtask_schema_1.SubtaskSchema,
                },
            ]),
            users_module_1.UsersModule
        ],
        controllers: [projects_controller_1.ProjectsController],
        providers: [projects_service_1.ProjectsService, project_repository_1.ProjectRepository, project_middleware_1.ProjectMiddleware],
        exports: [projects_service_1.ProjectsService, project_repository_1.ProjectRepository, project_middleware_1.ProjectMiddleware],
    })
], ProjectsModule);
//# sourceMappingURL=projects.module.js.map