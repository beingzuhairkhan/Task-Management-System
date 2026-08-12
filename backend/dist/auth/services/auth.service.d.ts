import { OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { UserRepository } from '../../users/repositories/user.repository';
import { User } from '../../users/schemas/user.schema';
export declare class AuthService implements OnModuleInit, OnModuleDestroy {
    private readonly userRepository;
    private readonly redisClient;
    constructor(userRepository: UserRepository);
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
    validateUserById(id: string): Promise<User | null>;
    findOrCreateFromGoogle(profile: {
        googleId: string;
        email: string;
        displayName: string;
        avatar?: string;
    }): Promise<User>;
    logout(jti: string, exp: number): Promise<{
        message: string;
    }>;
    isTokenBlacklisted(jti: string): Promise<boolean>;
}
