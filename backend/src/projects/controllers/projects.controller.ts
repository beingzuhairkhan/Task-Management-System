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
import { InviteMemberDto } from '../dto/invite-member.dto';
import { UpdateMemberRoleDto } from '../dto/update-member-role.dto';
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

  @Post(':id/members')
  @UseGuards(ProjectRolesGuard)
  @ProjectRoles(ProjectRole.OWNER)
  @ApiOperation({ summary: 'Invite a member to the project (owner only)' })
  @ApiResponse({ status: 200, description: 'Member invited' })
  inviteMember(@Param('id') id: string, @Body() dto: InviteMemberDto) {
    return this.projectsService.inviteMember(id, dto);
  }

  @Patch(':id/members/:userId')
  @UseGuards(ProjectRolesGuard)
  @ProjectRoles(ProjectRole.OWNER)
  @ApiOperation({ summary: 'Update a member role (owner only)' })
  @ApiResponse({ status: 200, description: 'Member role updated' })
  updateMemberRole(
    @Param('id') id: string,
    @Param('userId') userId: string,
    @Body() dto: UpdateMemberRoleDto,
  ) {
    return this.projectsService.updateMemberRole(id, userId, dto);
  }

  @Delete(':id/members/:userId')
  @UseGuards(ProjectRolesGuard)
  @ProjectRoles(ProjectRole.OWNER)
  @ApiOperation({ summary: 'Remove a member from the project (owner only)' })
  @ApiResponse({ status: 200, description: 'Member removed' })
  removeMember(@Param('id') id: string, @Param('userId') userId: string) {
    return this.projectsService.removeMember(id, userId);
  }
}
