"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const config_1 = require("@nestjs/config");
const app_module_1 = require("./app.module");
const global_exception_filter_1 = require("./common/filters/global-exception.filter");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const configService = app.get(config_1.ConfigService);
    const logger = new common_1.Logger('Bootstrap');
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
    }));
    app.useGlobalFilters(new global_exception_filter_1.GlobalExceptionFilter());
    app.enableCors({
        origin: configService.get('clientUrl') || 'http://localhost:3000',
        credentials: true,
    });
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Task Management API')
        .setDescription('A production-ready Task Management System API (ClickUp/Jira-like) with Google OAuth, JWT auth, projects, groups, tasks, subtasks, comments, labels, attachments, and activity logging.')
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
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/docs', app, document);
    const port = configService.get('port') || 4000;
    await app.listen(port);
    logger.log(`Application running on http://localhost:${port}`);
    logger.log(`Swagger documentation at http://localhost:${port}/api/docs`);
}
bootstrap();
//# sourceMappingURL=main.js.map