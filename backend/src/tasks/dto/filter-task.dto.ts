import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsMongoId,
  IsOptional,
  IsString
} from 'class-validator';

import {
  Group,
  TaskPriority,
  TaskStatus,
} from '../../common/enums';

export class FilterTaskDto {

   @ApiPropertyOptional({
    description: 'Search by project title or description',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    enum: TaskStatus,
  })
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @ApiPropertyOptional({
    enum: TaskPriority,
  })
  @IsOptional()
  @IsEnum(TaskPriority)
  priority?: TaskPriority;

  @ApiPropertyOptional({
    enum: Group,
  })
  @IsOptional()
  @IsEnum(Group)
  group?: Group;

  @ApiPropertyOptional({
    type: [String],
    description: 'Filter by member user IDs',
  })
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  members?: string[];
}