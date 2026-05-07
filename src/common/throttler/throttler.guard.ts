import { Injectable, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { ThrottlerGuard, ThrottlerException } from '@nestjs/throttler';

@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
  protected async getTracker(req: Record<string, any>): Promise<string> {
    // Priority: Cloudflare -> Reverse Proxy -> Client IP
    const ip = 
      req.headers['cf-connecting-ip'] || 
      req.headers['x-forwarded-for']?.split(',')[0].trim() || 
      req.headers['x-real-ip'] || 
      req.ip || 
      req.socket.remoteAddress;
    
    return ip;
  }

  protected throwThrottlingException(context: ExecutionContext): Promise<void> {
    throw new HttpException(
      {
        statusCode: HttpStatus.TOO_MANY_REQUESTS,
        message: 'Too many requests, please try again later.',
        error: 'ThrottlerException',
        retryAfter: 'Check Retry-After header for details',
      },
      HttpStatus.TOO_MANY_REQUESTS,
    );
  }
}
