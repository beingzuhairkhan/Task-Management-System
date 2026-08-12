import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import { UserRepository } from '../../users/repositories/user.repository';
export interface GoogleProfile {
    id: string;
    displayName: string;
    emails: {
        value: string;
        verified: boolean;
    }[];
    photos: {
        value: string;
    }[];
}
declare const GoogleStrategy_base: new (...args: any[]) => Strategy;
export declare class GoogleStrategy extends GoogleStrategy_base {
    private configService;
    private userRepository;
    constructor(configService: ConfigService, userRepository: UserRepository);
    authenticate(req: any, options?: any): Promise<void>;
    validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<void>;
    private generateUsername;
}
export {};
