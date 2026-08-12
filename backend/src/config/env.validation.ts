import { IsString, IsNumber, IsOptional } from 'class-validator';

export class EnvironmentConfig {
  @IsString()
  port: number;

  @IsString()
  nodeEnv: string;

  @IsString()
  mongodbUri: string;

  @IsString()
  jwtSecret: string;

  @IsString()
  jwtExpiresIn: string;

  @IsString()
  googleClientId: string;

  @IsString()
  googleClientSecret: string;

  @IsString()
  googleCallbackUrl: string;

  @IsString()
  @IsOptional()
  clientUrl?: string;
}
