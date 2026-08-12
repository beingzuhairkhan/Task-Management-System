import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { TokenService } from '../services/token.service';
import { AuthService } from './../services/auth.service';
export declare class AuthController {
    private tokenService;
    private configService;
    private authService;
    private readonly logger;
    constructor(tokenService: TokenService, configService: ConfigService, authService: AuthService);
    googleAuth(): void;
    googleAuthCallback(req: Request, res: Response): Promise<void>;
    me(req: Request): Promise<Express.User>;
    logout(user: any): Promise<{
        message: string;
    }>;
}
