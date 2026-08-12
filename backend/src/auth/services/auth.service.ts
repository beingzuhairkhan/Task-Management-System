
import {
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';

import { UserRepository } from '../../users/repositories/user.repository';
import { User } from '../../users/schemas/user.schema';

@Injectable()
export class AuthService
  implements OnModuleInit, OnModuleDestroy {
  private readonly redisClient: RedisClientType;

  constructor(
    private readonly userRepository: UserRepository,
  ) {
    this.redisClient = createClient({
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

  async validateUserById(
    id: string,
  ): Promise<User | null> {
    return this.userRepository.findById(id);
  }

  async findOrCreateFromGoogle(profile: {
    googleId: string;
    email: string;
    displayName: string;
    avatar?: string;
  }) {
    let user = await this.userRepository.findByGoogleId(
      profile.googleId,
    );

    if (user) return user;

    user = await this.userRepository.findByEmail(
      profile.email,
    );

    if (user) return user;

    return this.userRepository.create({
      username:
        profile.displayName ||
        profile.email.split('@')[0],
      email: profile.email,
      googleId: profile.googleId,
      avatar: profile.avatar,
      provider: 'GOOGLE' as any,
      role: 'USER' as any,
      isActive: true,
      lastLogin: new Date(),
    });
  }

  async logout(jti: string, exp: number) {

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
      const result = await this.redisClient.set(
        key,
        '1',
        {
          EX: expiresIn,
        },
      );

      await this.redisClient.get(key);

      await this.redisClient.ttl(key);


      return {
        message: 'Logged out successfully',
      };
    } catch (error) {
      console.error('REDIS ERROR:', error);

      throw error;
    }
  }

  async isTokenBlacklisted(
    jti: string,
  ): Promise<boolean> {
    const exists = await this.redisClient.exists(
      `blacklist:${jti}`,
    );

    return exists === 1;
  }
}

