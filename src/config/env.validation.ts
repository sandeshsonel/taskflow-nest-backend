import { plainToInstance } from 'class-transformer';
import { IsEnum, IsNumber, IsString, IsOptional, validateSync } from 'class-validator';

enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
  Provision = 'provision',
}

export class EnvironmentVariables {
  @IsEnum(Environment)
  NODE_ENV: Environment;

  @IsNumber()
  PORT: number;

  @IsString()
  TZ: string;

  @IsString()
  ALLOWED_ORIGINS: string;

  @IsString()
  LOG_DIR: string;

  @IsString()
  MONGO_URI: string;

  @IsString()
  MONGO_DB_NAME: string;

  @IsNumber()
  MONGO_MIN_POOL_SIZE: number;

  @IsNumber()
  MONGO_MAX_POOL_SIZE: number;

  @IsString()
  JWT_SECRET: string;

  @IsNumber()
  ACCESS_TOKEN_VALIDITY_SEC: number;

  @IsNumber()
  REFRESH_TOKEN_VALIDITY_SEC: number;

  @IsString()
  TOKEN_ISSUER: string;

  @IsString()
  TOKEN_AUDIENCE: string;

  @IsString()
  SUPER_ADMIN_API_KEY: string;

  @IsString()
  REDIS_HOST: string;

  @IsNumber()
  REDIS_PORT: number;

  @IsNumber()
  CONTENT_CACHE_DURATION_MILLIS: number;

  @IsOptional()
  @IsString()
  VERCEL_OIDC_TOKEN?: string;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(
    EnvironmentVariables,
    config,
    { enableImplicitConversion: true },
  );
  
  const errors = validateSync(validatedConfig, { skipMissingProperties: false });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  
  return validatedConfig;
}
