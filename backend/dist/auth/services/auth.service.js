"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const redis_1 = require("redis");
const user_repository_1 = require("../../users/repositories/user.repository");
const token_service_1 = require("./token.service");
let AuthService = class AuthService {
    constructor(userRepository, tokenService) {
        this.userRepository = userRepository;
        this.tokenService = tokenService;
        this.redisClient = (0, redis_1.createClient)({
            url: process.env.REDIS_URL,
        });
        this.redisClient.on('error', (err) => {
            console.error('Redis Error:', err);
        });
    }
    async onModuleInit() {
        await this.redisClient.connect();
    }
    async onModuleDestroy() {
        await this.redisClient.quit();
    }
    async validateUserById(id) {
        return this.userRepository.findById(id);
    }
    async findOrCreateFromGoogle(profile) {
        let user = await this.userRepository.findByGoogleId(profile.googleId);
        if (user)
            return user;
        user = await this.userRepository.findByEmail(profile.email);
        if (user)
            return user;
        return this.userRepository.create({
            username: profile.displayName ||
                profile.email.split('@')[0],
            email: profile.email,
            googleId: profile.googleId,
            avatar: profile.avatar,
            provider: 'GOOGLE',
            role: 'USER',
            isActive: true,
            lastLogin: new Date(),
        });
    }
    async logout(jti, exp) {
        if (!jti) {
            return {
                message: 'Invalid token: jti is missing',
            };
        }
        if (!exp) {
            return {
                message: 'Invalid token: exp is missing',
            };
        }
        const now = Math.floor(Date.now() / 1000);
        const expiresIn = exp - now;
        if (expiresIn <= 0) {
            return {
                message: 'Token already expired',
            };
        }
        const key = `blacklist:${jti}`;
        try {
            const result = await this.redisClient.set(key, '1', {
                EX: expiresIn,
            });
            await this.redisClient.get(key);
            await this.redisClient.ttl(key);
            return {
                message: 'Logged out successfully',
            };
        }
        catch (error) {
            console.error('REDIS ERROR:', error);
            throw error;
        }
    }
    async isTokenBlacklisted(jti) {
        const exists = await this.redisClient.exists(`blacklist:${jti}`);
        return exists === 1;
    }
    async refreshAccessToken(refreshToken) {
        try {
            const payload = this.tokenService.verifyRefreshToken(refreshToken);
            if (payload.type !== 'refresh') {
                throw new common_1.UnauthorizedException('Invalid refresh token');
            }
            const blacklisted = await this.isTokenBlacklisted(payload.jti);
            if (blacklisted) {
                throw new common_1.UnauthorizedException('Refresh token has been revoked');
            }
            const user = await this.userRepository.findById(payload.sub);
            if (!user) {
                throw new common_1.UnauthorizedException('User no longer exists');
            }
            const accessToken = this.tokenService.generateAccessToken(user);
            return {
                accessToken,
            };
        }
        catch (error) {
            if (error instanceof common_1.UnauthorizedException) {
                throw error;
            }
            throw new common_1.UnauthorizedException('Invalid or expired refresh token');
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_repository_1.UserRepository,
        token_service_1.TokenService])
], AuthService);
//# sourceMappingURL=auth.service.js.map