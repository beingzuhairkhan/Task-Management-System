import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProjectSchema } from './schemas/project.schema';
import { ProjectRepository } from './repositories/project.repository';
import { ProjectsService } from './services/projects.service';
import { ProjectsController } from './controllers/projects.controller';
import { ProjectMiddleware } from './middleware/project.middleware';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Project', schema: ProjectSchema }]),
    UsersModule
  ],
  controllers: [ProjectsController],
  providers: [ProjectsService, ProjectRepository, ProjectMiddleware],
  exports: [ProjectsService, ProjectRepository, ProjectMiddleware],
})
export class ProjectsModule { }
