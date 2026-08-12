import { UserRepository } from '../repositories/user.repository';
import { UpdateUserDto } from '../dto/update-user.dto';
import { InviteUserDto } from '../dto/invite-user.dto';
import { PaginationDto, PaginatedResult } from '../../common';
import { ConfigService } from '@nestjs/config';
export declare class UsersService {
    private readonly userRepository;
    private readonly configService;
    private readonly transporter;
    private readonly logger;
    constructor(userRepository: UserRepository, configService: ConfigService);
    findAll(dto: PaginationDto): Promise<PaginatedResult<any>>;
    findById(id: string): Promise<import("../schemas/user.schema").User>;
    update(id: string, dto: UpdateUserDto): Promise<import("../schemas/user.schema").User>;
    remove(id: string): Promise<void>;
    invite(dto: InviteUserDto): Promise<{
        message: string;
        email: string;
    }>;
}
