import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ProjectRole } from '../../common/enums';

export class InviteMemberDto {
  @ApiProperty({ description: 'User ID to invite' })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ enum: ProjectRole, default: ProjectRole.MEMBER })
  @IsEnum(ProjectRole)
  role: ProjectRole;
}
