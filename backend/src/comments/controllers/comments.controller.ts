import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CommentsService } from '../services/comments.service';
import { CreateCommentDto } from '../dto/create-comment.dto';
import { UpdateCommentDto } from '../dto/update-comment.dto';
import { JwtAuthGuard, Auth, CurrentUser } from '../../common';

@ApiTags('Comments')
@Controller('tasks/:taskId/comments')
@UseGuards(JwtAuthGuard)
@Auth()
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a comment on a task' })
  @ApiResponse({ status: 201, description: 'Comment created' })
  create(
    @Param('taskId') taskId: string,
    @Body() dto: CreateCommentDto,
    @CurrentUser() user: any,
  ) {
    return this.commentsService.create(dto, taskId, user._id);
  }

  @Get()
  @ApiOperation({ summary: 'List comments for a task' })
  @ApiResponse({ status: 200, description: 'List of comments' })
  findAll(@Param('taskId') taskId: string) {
    return this.commentsService.findByTaskId(taskId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update your comment' })
  @ApiResponse({ status: 200, description: 'Comment updated' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateCommentDto,
    @CurrentUser() user: any,
  ) {
    return this.commentsService.update(id, dto, user._id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete your comment' })
  @ApiResponse({ status: 204, description: 'Comment deleted' })
  async remove(@Param('id') id: string, @CurrentUser() user: any) {
    await this.commentsService.remove(id, user._id);
  }
}
