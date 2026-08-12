import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

import {
  TaskPriority,
  TaskStatus,
  Group,
} from '../../common/enums';

export class CreateTaskDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'User ID' })
  @IsOptional()
  ownerId?: string;

  @ApiPropertyOptional({
    enum: Group,
    default: Group.TODO,
  })
  @IsOptional()
  @IsEnum(Group)
  group?: Group;

  @ApiPropertyOptional({
    enum: TaskStatus,
    default: TaskStatus.PLANNED,
  })
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @ApiPropertyOptional({
    enum: TaskPriority,
    default: TaskPriority.MEDIUM,
  })
  @IsOptional()
  @IsEnum(TaskPriority)
  priority?: TaskPriority;

  @ApiPropertyOptional({
    type: [String],
    description: 'User IDs to assign',
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  members?: string[];

  @ApiPropertyOptional({
    type: [String],
    description: 'Label names',
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  labels?: string[];

  @ApiProperty({ description: 'User ID of the reporter' })
  @IsString()
  @IsNotEmpty()
  reporter: string;

  @ApiPropertyOptional({
    type: String,
    format: 'date-time',
  })
  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @ApiPropertyOptional({
    type: String,
    format: 'date-time',
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @IsNumber()
  estimatedHours?: number;

  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @IsNumber()
  spentHours?: number;

  @ApiPropertyOptional({ 
    type: [String], description: 'Task resources', })
     @IsOptional() 
     @IsArray() 
     @IsString({ each: true }) 
     resources?: string[];


}