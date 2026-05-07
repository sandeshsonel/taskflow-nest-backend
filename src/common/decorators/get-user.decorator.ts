import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayload } from '@modules/auth/interfaces/jwt-payload.interface';

/**
 * Custom decorator to extract the user object or a specific property from the request.
 *
 * Usage:
 *   @GetUser() user: JwtPayload
 *   @GetUser('email') email: string
 */
export const GetUser = createParamDecorator(
    (data: keyof JwtPayload | undefined, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        const user = request.user as JwtPayload;

        return data ? user?.[data] : user;
    },
);

