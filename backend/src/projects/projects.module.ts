import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProjectSchema } from './schemas/project.schema';
import { ProjectRepository } from './repositories/project.repository';
import { ProjectsService } from './services/projects.service';
import { ProjectsController } from './controllers/projects.controller';
import { ProjectMiddleware } from './middleware/project.middleware';
import { UsersModule } from 'src/users/users.module';
import { Subtask , SubtaskSchema } from 'src/subtasks/schemas/subtask.schema';
import { Task, TaskSchema } from 'src/tasks/schemas/task.schema';
@Module({
  imports: [MongooseModule.forFeature([{ name: 'Project', schema: ProjectSchema },
      {
    name: Task.name,
    schema: TaskSchema,
  },
   {
    name: Subtask.name,
    schema: SubtaskSchema,
  },
  ]),
    UsersModule
  ],
  controllers: [ProjectsController],
  providers: [ProjectsService, ProjectRepository, ProjectMiddleware],
  exports: [ProjectsService, ProjectRepository, ProjectMiddleware],
})
export class ProjectsModule { }
