import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ProjectsService } from '../services/projects.service';
import { CreateProjectDto } from '../dto/create-project.dto';
import { UpdateProjectDto } from '../dto/update-project.dto';
import { GenerateDescriptionDto } from '../dto/generate-description.dto';
import {
  JwtAuthGuard,
  Auth,
  CurrentUser,
  ProjectRoles,
  ProjectRolesGuard,
  PaginationDto,
} from '../../common';
import { ProjectRole } from '../../common/enums';
import { ProjectMiddleware } from '../middleware/project.middleware';

@ApiTags('Projects')
@Controller('projects')
@UseGuards(JwtAuthGuard)
@Auth()
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new project' })
  @ApiResponse({ status: 201, description: 'Project created' })
  create(@Body() dto: CreateProjectDto, @CurrentUser() user: any) {
    return this.projectsService.create(dto, user._id);
  }

  @Get()
  @ApiOperation({ summary: 'List projects for the current user' })
  @ApiResponse({ status: 200, description: 'Paginated projects' })
  findAll(@Query() dto: PaginationDto, @CurrentUser() user: any) {
    return this.projectsService.findAll(dto, user._id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a project by id' })
  @ApiResponse({ status: 200, description: 'Project details' })
  findOne(@Param('id') id: string) {
    return this.projectsService.findById(id);
  }

  @Patch(':id')
  @UseGuards(ProjectRolesGuard)
  @ProjectRoles(ProjectRole.OWNER)
  @ApiOperation({ summary: 'Update a project (owner only)' })
  @ApiResponse({ status: 200, description: 'Project updated' })
  update(@Param('id') id: string, @Body() dto: UpdateProjectDto) {
    return this.projectsService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(ProjectRolesGuard)
  @ProjectRoles(ProjectRole.OWNER)
  @ApiOperation({ summary: 'Delete a project (owner only)' })
  @ApiResponse({ status: 204, description: 'Project deleted' })
  async remove(@Param('id') id: string , @CurrentUser() user: any) {
    await this.projectsService.remove(id , user._id);
  }

   @Post('generate-description')
  async generateDescription(
    @Body() dto: GenerateDescriptionDto,
  ) {
    const description =
      await this.projectsService.generateProjectDescription(
        dto.title,
      );

    return {
      description,
    };
  }




}
