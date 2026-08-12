import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { LabelsService } from '../services/labels.service';
import { CreateLabelDto } from '../dto/create-label.dto';
import { UpdateLabelDto } from '../dto/update-label.dto';
import { JwtAuthGuard, Auth } from '../../common';

@ApiTags('Labels')
@Controller('labels')
@UseGuards(JwtAuthGuard)
@Auth()
export class LabelsController {
  constructor(private readonly labelsService: LabelsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a label' })
  @ApiResponse({ status: 201, description: 'Label created' })
  create(@Body() dto: CreateLabelDto) {
    return this.labelsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all labels' })
  @ApiResponse({ status: 200, description: 'List of labels' })
  findAll() {
    return this.labelsService.findAll();
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a label' })
  @ApiResponse({ status: 200, description: 'Label updated' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateLabelDto,
  ) {
    return this.labelsService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a label' })
  @ApiResponse({ status: 204, description: 'Label deleted' })
  async remove(@Param('id') id: string): Promise<void> {
    await this.labelsService.remove(id);
  }
}