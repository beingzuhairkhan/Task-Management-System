import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from '../../users/schemas/user.schema';
import { JwtPayload } from '../../config/jwt-payload.interface';
export declare class TokenService {
    private jwtService;
    private configService;
    constructor(jwtService: JwtService, configService: ConfigService);
    generateAccessToken(user: User): string;
    verifyToken(token: string): JwtPayload;
}
