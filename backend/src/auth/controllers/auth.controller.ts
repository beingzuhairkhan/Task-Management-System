import {
  Controller,
  Get,
  UseGuards,
  Req,
  Res,
  Logger,
  Query,
  Post,
  Body
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { TokenService } from '../services/token.service';
import { Public } from '../../common/decorators/public.decorator';
import { User } from '../../users/schemas/user.schema';
import { AuthService } from './../services/auth.service';
import {
  CurrentUser,

} from '../../common';
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private tokenService: TokenService,
    private configService: ConfigService,
    private authService: AuthService
  ) { }

  @Get('google')
  @Public()
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Initiate Google OAuth login' })
  googleAuth() {
    // Passport handles the redirect to Google
  }

  @Get('google/callback')
  @Public()
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Google OAuth callback' })
  @ApiResponse({ status: 302, description: 'Redirects to client with JWT token' })
  async googleAuthCallback(@Req() req: Request, @Res() res: Response) {
    const user = req.user as User;
    if (!user) {
      return res.redirect(`${this.configService.get<string>('clientUrl')}/login?error=no_user`);
    }

    const accessToken =
      this.tokenService.generateAccessToken(user);

    const refreshToken =
      this.tokenService.generateRefreshToken(user);
    const redirectUrl =
      this.configService.get<string>('clientUrl');
    this.logger.log(`User ${user.email} authenticated via Google OAuth`);
    res.redirect(
      `${redirectUrl}/auth/callback?accessToken=${accessToken}&refreshToken=${refreshToken}`,
    );
  }

  @Get('me')
  @ApiOperation({ summary: 'Get current authenticated user' })
  @ApiResponse({ status: 200, description: 'Current user info' })
  async me(@Req() req: Request) {
    return req.user;
  }

  @Post('refresh')
  @Public()
  @ApiOperation({ summary: 'Refresh access token' })
  async refresh(@Body('refreshToken') refreshToken: string) {
    return this.authService.refreshAccessToken(refreshToken);
  }

@Get('health')
@Public()
getHealth() {
  return {
    status: 'ok',
    message: 'Auth API is healthy',
    timestamp: new Date().toISOString(),
  };
}


  @Post('logout')
  async logout(@CurrentUser() user: any) {
    const result = await this.authService.logout(
      user?.jti,
      user?.exp,
    );
    return result;
  }
}
