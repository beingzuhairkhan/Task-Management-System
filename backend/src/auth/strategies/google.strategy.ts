import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import { UserRepository } from '../../users/repositories/user.repository';
import { UserProvider, UserRole } from '../../common/enums';

export interface GoogleProfile {
  id: string;
  displayName: string;
  emails: { value: string; verified: boolean }[];
  photos: { value: string }[];
}

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private configService: ConfigService,
    private userRepository: UserRepository,
  ) {
    super({
      clientID: configService.get<string>('google.clientId'),
      clientSecret: configService.get<string>('google.clientSecret'),
      callbackURL: configService.get<string>('google.callbackUrl'),
      scope: ['email', 'profile'],
    });
  }

  async authenticate(req: any, options?: any): Promise<void> {
    const clientId = this.configService.get<string>('google.clientId');
    if (!clientId) {
      throw new UnauthorizedException(
        'Google OAuth is not configured. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET.',
      );
    }
    super.authenticate(req, options);
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<void> {
    const googleId = profile.id;
    const email = profile.emails?.[0]?.value;
    if (!email) {
      return done(new UnauthorizedException('Google account has no email'), undefined);
    }

    let user = await this.userRepository.findByGoogleId(googleId);
    if (!user) {
      user = await this.userRepository.findByEmail(email);
      if (user) {
        user = await this.userRepository.update(user._id as unknown as string, {
          googleId,
          provider: UserProvider.GOOGLE,
          avatar: profile.photos?.[0]?.value || user.avatar,
        } as any);
      } else {
        const username = this.generateUsername(profile.displayName, email);
        user = await this.userRepository.create({
          username,
          email,
          googleId,
          avatar: profile.photos?.[0]?.value,
          provider: UserProvider.GOOGLE,
          role: UserRole.USER,
          isActive: true,
          lastLogin: new Date(),
        });
      }
    }

    await this.userRepository.updateLastLogin(user._id as unknown as string);
    return done(null, user);
  }

  private generateUsername(displayName: string, email: string): string {
    const base = (displayName || email.split('@')[0])
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '');
    return `${base}_${Math.random().toString(36).slice(2, 8)}`;
  }
}
