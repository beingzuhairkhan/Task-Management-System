export interface JwtPayload {
    sub: string;
    email: string;
    username: string;
    role: string;
    jti: string;
    exp?: number;
    type?: 'access' | 'refresh';
}
