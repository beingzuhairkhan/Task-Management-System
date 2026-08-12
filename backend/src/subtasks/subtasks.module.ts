import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SubtaskSchema } from './schemas/subtask.schema';
import { SubtaskRepository } from './repositories/subtask.repository';
import { SubtasksService } from './services/subtasks.service';
import { SubtasksController } from './controllers/subtasks.controller';
import { ActivityModule } from '../activity/activity.module';
import { User , UserSchema } from 'src/users/schemas/user.schema';
import { Task , TaskSchema } from 'src/tasks/schemas/task.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Subtask', schema: SubtaskSchema },
     {
        name: User.name,
          schema: UserSchema,
     },
     {
         name: Task.name,
         schema: TaskSchema,
       },

    ]),
    ActivityModule,
  ],
  controllers: [SubtasksController],
  providers: [SubtasksService, SubtaskRepository],
  exports: [SubtasksService, SubtaskRepository , MongooseModule],
})
export class SubtasksModule {}
