import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UserRepository } from '../../users/repositories/user.repository';
import { JwtPayload } from '../../config/jwt-payload.interface';
import { AuthService } from './../services/auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private authService: AuthService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: JwtPayload) {
  const { jti } = payload;

  if (!jti) {
    throw new UnauthorizedException('Invalid token');
  }

  if (payload.type !== 'access') {
    throw new UnauthorizedException('Invalid access token');
  }

  const blacklisted =
    await this.authService.isTokenBlacklisted(jti);

  if (blacklisted) {
    throw new UnauthorizedException(
      'Token has been revoked',
    );
  }

  return {
    _id: payload.sub,
    email: payload.email,
    role: payload.role,
    jti: payload.jti,
    exp: payload.exp,
  };
}
}