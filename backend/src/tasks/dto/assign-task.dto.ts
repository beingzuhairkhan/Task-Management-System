import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { TaskStatus } from '../../common/enums';

export class AssignTaskDto {
  @ApiProperty({ description: 'User ID to assign' })
  @IsString()
  @IsNotEmpty()
  userId: string;
}