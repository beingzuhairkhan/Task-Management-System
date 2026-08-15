import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const logger = new Logger('Bootstrap');

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.useGlobalFilters(new GlobalExceptionFilter());

  app.enableCors({
    origin: configService.get<string>('clientUrl') || 'http://localhost:3000',
    credentials: true,
  });


  const config = new DocumentBuilder()
    .setTitle('Task Management API')
    .setDescription(
      'A production-ready Task Management System API (ClickUp/Jira-like) with Google OAuth, JWT auth, projects, groups, tasks, subtasks, comments, labels, attachments, and activity logging.',
    )
    .setVersion('1.0.0')
    .addBearerAuth()
    .addTag('Auth', 'Google OAuth & JWT authentication')
    .addTag('Users', 'User management')
    .addTag('Projects', 'Project CRUD & member management')
    .addTag('Tasks', 'Task CRUD, assignment, drag & drop ordering')
    .addTag('Subtasks', 'Subtask management')
    .addTag('Comments', 'Task comments')
    .addTag('Labels', 'Project labels')
    .addTag('Activity', 'Activity logging')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = configService.get<number>('port') || 4000;
  await app.listen(port);
  logger.log(`Application running on http://localhost:${port}`);
  logger.log(`Swagger documentation at http://localhost:${port}/api/docs`);
}
bootstrap();
