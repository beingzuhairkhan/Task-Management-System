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
exports.GoogleStrategy = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const passport_google_oauth20_1 = require("passport-google-oauth20");
const config_1 = require("@nestjs/config");
const user_repository_1 = require("../../users/repositories/user.repository");
const enums_1 = require("../../common/enums");
let GoogleStrategy = class GoogleStrategy extends (0, passport_1.PassportStrategy)(passport_google_oauth20_1.Strategy, 'google') {
    constructor(configService, userRepository) {
        super({
            clientID: configService.get('google.clientId'),
            clientSecret: configService.get('google.clientSecret'),
            callbackURL: configService.get('google.callbackUrl'),
            scope: ['email', 'profile'],
        });
        this.configService = configService;
        this.userRepository = userRepository;
    }
    async authenticate(req, options) {
        const clientId = this.configService.get('google.clientId');
        if (!clientId) {
            throw new common_1.UnauthorizedException('Google OAuth is not configured. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET.');
        }
        super.authenticate(req, options);
    }
    async validate(accessToken, refreshToken, profile, done) {
        const googleId = profile.id;
        const email = profile.emails?.[0]?.value;
        if (!email) {
            return done(new common_1.UnauthorizedException('Google account has no email'), undefined);
        }
        let user = await this.userRepository.findByGoogleId(googleId);
        if (!user) {
            user = await this.userRepository.findByEmail(email);
            if (user) {
                user = await this.userRepository.update(user._id, {
                    googleId,
                    provider: enums_1.UserProvider.GOOGLE,
                    avatar: profile.photos?.[0]?.value || user.avatar,
                });
            }
            else {
                const username = this.generateUsername(profile.displayName, email);
                user = await this.userRepository.create({
                    username,
                    email,
                    googleId,
                    avatar: profile.photos?.[0]?.value,
                    provider: enums_1.UserProvider.GOOGLE,
                    role: enums_1.UserRole.USER,
                    isActive: true,
                    lastLogin: new Date(),
                });
            }
        }
        await this.userRepository.updateLastLogin(user._id);
        return done(null, user);
    }
    generateUsername(displayName, email) {
        const base = (displayName || email.split('@')[0])
            .toLowerCase()
            .replace(/[^a-z0-9]/g, '');
        return `${base}_${Math.random().toString(36).slice(2, 8)}`;
    }
};
exports.GoogleStrategy = GoogleStrategy;
exports.GoogleStrategy = GoogleStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        user_repository_1.UserRepository])
], GoogleStrategy);
//# sourceMappingURL=google.strategy.js.map