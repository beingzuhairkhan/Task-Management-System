import {
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  Post
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UsersService } from '../services/users.service';
import { UpdateUserDto } from '../dto/update-user.dto';
import { InviteUserDto } from '../dto/invite-user.dto';
import {
  JwtAuthGuard,
  Auth,
  CurrentUser,
  PaginationDto,
} from '../../common';

@ApiTags('Users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@Auth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'List all users with pagination, search, sort' })
  @ApiResponse({ status: 200, description: 'Paginated list of users' })
  findAll(@Query() dto: PaginationDto, @CurrentUser() user: any) {
    return this.usersService.findAll(dto);
  }

  @Get('me')
  @ApiOperation({ summary: 'Get current authenticated user' })
  @ApiResponse({ status: 200, description: 'Current user profile' })
  findMe(@CurrentUser() user: any) {
    return this.usersService.findById(user._id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a user by id' })
  @ApiResponse({ status: 200, description: 'User found' })
  findOne(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Patch('me')
@ApiOperation({ summary: 'Update current authenticated user' })
@ApiResponse({ status: 200, description: 'Current user updated' })
updateMe(
  @CurrentUser() user: any,
  @Body() dto: UpdateUserDto,
) {
  return this.usersService.update(user._id, dto);
}

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user' })
  @ApiResponse({ status: 204, description: 'User deleted' })
  async remove(@Param('id') id: string) {
    await this.usersService.remove(id);
  }


  @Post('invite')
@ApiOperation({summary: 'Invite a person by email',})
@ApiResponse({status: 201,description: 'Invitation email sent'})
@ApiResponse({status: 409,description: 'User already exists',})
invite(@Body() dto: InviteUserDto) {
  return this.usersService.invite(dto);
}
}
