import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Task, TaskSchema } from './schemas/task.schema';
import { TaskRepository } from './repositories/task.repository';
import { TasksService } from './services/tasks.service';
import { TasksController } from './controllers/tasks.controller';
import { ActivityModule } from '../activity/activity.module';
import { User, UserSchema } from 'src/users/schemas/user.schema';
import { Label, LabelSchema } from 'src/labels/schemas/label.schema';
import { Subtask , SubtaskSchema } from 'src/subtasks/schemas/subtask.schema';

@Module({
  imports: [
    MongooseModule.forFeature([ {
    name: User.name,
    schema: UserSchema,
  },
  {
    name: Task.name,
    schema: TaskSchema,
  },
   {
    name: Label.name,
    schema: LabelSchema,
  },
   {
    name: Subtask.name,
    schema: SubtaskSchema,
  },

]),
    ActivityModule,
  ],
  controllers: [TasksController],
  providers: [TasksService, TaskRepository],
  exports: [TasksService, TaskRepository],
})
export class TasksModule {}
