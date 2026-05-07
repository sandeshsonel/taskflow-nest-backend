import { Throttle, SkipThrottle } from '@nestjs/throttler';
import { applyDecorators } from '@nestjs/common';
import { THROTTLER_LIMITS } from './throttler.constants';

/**
 * Skip throttling for this route
 */
export const PublicRoute = () => SkipThrottle();

/**
 * Strict rate limit (e.g. for Auth, Password Reset)
 */
export const StrictThrottle = () => 
  Throttle({ default: THROTTLER_LIMITS.AUTH });

/**
 * Registration rate limit (very strict)
 */
export const RegistrationThrottle = () => 
  Throttle({ default: THROTTLER_LIMITS.REGISTRATION });

/**
 * Password reset rate limit
 */
export const PasswordResetThrottle = () => 
  Throttle({ default: THROTTLER_LIMITS.PASSWORD_RESET });

/**
 * Relaxed rate limit (e.g. for heavy data fetching)
 */
export const RelaxedThrottle = () => 
  Throttle({ default: THROTTLER_LIMITS.LONG });

/**
 * Public API rate limit
 */
export const PublicThrottle = () => 
  Throttle({ default: THROTTLER_LIMITS.PUBLIC });

/**
 * Internal API rate limit
 */
export const InternalThrottle = () => 
  Throttle({ default: THROTTLER_LIMITS.INTERNAL });
