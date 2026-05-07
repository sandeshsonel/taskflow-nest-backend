import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

/**
 * Extracts the authenticated user from the request.
 *
 * Usage:
 *   @Get('profile')
 *   getProfile(@CurrentUser() user: JwtPayload) { ... }
 *
 *   @Get('email')
 *   getEmail(@CurrentUser('email') email: string) { ... }
 */
export const CurrentUser = createParamDecorator(
  (data: keyof JwtPayload | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as JwtPayload;

    return data ? user?.[data] : user;
  },
);
