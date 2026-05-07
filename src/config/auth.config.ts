import { registerAs } from '@nestjs/config';

export default registerAs('auth', () => ({
  jwtSecret: process.env.JWT_SECRET || '',
  accessTokenValidity: parseInt(process.env.ACCESS_TOKEN_VALIDITY_SEC || '0', 10),
  refreshTokenValidity: parseInt(process.env.REFRESH_TOKEN_VALIDITY_SEC || '0', 10),
  issuer: process.env.TOKEN_ISSUER || '',
  audience: process.env.TOKEN_AUDIENCE || '',
  superAdminApiKey: process.env.SUPER_ADMIN_API_KEY || '',
}));
