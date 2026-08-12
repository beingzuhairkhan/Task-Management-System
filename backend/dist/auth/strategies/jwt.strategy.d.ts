import { Strategy } from 'passport-jwt';
import { JwtPayload } from '../../config/jwt-payload.interface';
import { AuthService } from './../services/auth.service';
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private authService;
    constructor(authService: AuthService);
    validate(payload: JwtPayload): Promise<{
        _id: string;
        email: string;
        role: string;
        jti: string;
        exp: number;
    }>;
}
export {};
