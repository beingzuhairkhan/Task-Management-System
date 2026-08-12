import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class MoveTaskDto {
  @ApiProperty({ description: 'Target group (board column) id' })
  @IsString()
  @IsNotEmpty()
  groupId: string;


}
