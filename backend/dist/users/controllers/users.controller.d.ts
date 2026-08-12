import { UsersService } from '../services/users.service';
import { UpdateUserDto } from '../dto/update-user.dto';
import { InviteUserDto } from '../dto/invite-user.dto';
import { PaginationDto } from '../../common';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAll(dto: PaginationDto, user: any): Promise<import("../../common").PaginatedResult<any>>;
    findMe(user: any): Promise<import("../schemas/user.schema").User>;
    findOne(id: string): Promise<import("../schemas/user.schema").User>;
    updateMe(user: any, dto: UpdateUserDto): Promise<import("../schemas/user.schema").User>;
    remove(id: string): Promise<void>;
    invite(dto: InviteUserDto): Promise<{
        message: string;
        email: string;
    }>;
}
