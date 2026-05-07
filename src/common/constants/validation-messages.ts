/**
 * Centralized i18n translation keys, organized by module.
 *
 * Each key maps to `{file}.{KEY}` in `src/i18n/{lang}/{file}.json`.
 * - ValidationKeys  → validation.json  (DTO decorators via i18nValidationMessage)
 * - AccountKeys     → account.json     (account service messages)
 * - AdminKeys       → admin.json       (admin service messages)
 * - CommonKeys      → common.json      (shared/generic messages)
 */

// ─── Validation (DTOs) ──────────────────────────────────────────────────────
export const ValidationKeys = {
  // General
  REQUIRED: 'validation.REQUIRED',
  INVALID_TYPE: 'validation.INVALID_TYPE',

  // String
  STRING_MIN: 'validation.STRING_MIN_VALIDATION',
  STRING_MAX: 'validation.STRING_MAX_VALIDATION',

  // Email
  EMAIL_INVALID: 'validation.VALID_EMAIL_ALLOWED',
  EMAIL_MIN: 'validation.EMAIL_MIN_VALIDATION',
  EMAIL_MAX: 'validation.EMAIL_MAX_VALIDATION',

  // Name
  NAME_MIN: 'validation.NAME_MIN_VALIDATION',
  NAME_MAX: 'validation.NAME_MAX_VALIDATION',

  // Password
  PASSWORD_MIN: 'validation.PASSWORD_MIN_VALIDATION',
  PASSWORD_MAX: 'validation.PASSWORD_MAX_VALIDATION',
  PASSWORD_MISMATCH: 'validation.PASSWORD_MISMATCH',

  // Role
  ROLE_INVALID: 'validation.ROLE_INVALID_VALIDATION',

  // Auth
  ID_TOKEN_REQUIRED: 'validation.ID_TOKEN_REQUIRED',
} as const;

// ─── Account module ─────────────────────────────────────────────────────────
export const AccountKeys = {
  SIGNUP_SUCCESS: 'account.SIGNUP_SUCCESS',
  SIGNIN_SUCCESS: 'account.SIGNIN_SUCCESS',
  USER_DETAILS_FETCHED: 'account.USER_DETAILS_FETCHED',

  EMAIL_ALREADY_REGISTERED: 'account.EMAIL_ALREADY_REGISTERED',
  EMAIL_REGISTERED_CONTACT_ADMIN: 'account.EMAIL_REGISTERED_CONTACT_ADMIN',
  USER_ALREADY_EXISTS: 'account.USER_ALREADY_EXISTS',
  USER_NOT_FOUND: 'account.USER_NOT_FOUND',
  USER_DETAILS_NOT_FOUND: 'account.USER_DETAILS_NOT_FOUND',

  INVALID_CREDENTIALS: 'account.INVALID_CREDENTIALS',
  INCORRECT_PASSWORD: 'account.INCORRECT_PASSWORD',
  ACCOUNT_SUSPENDED: 'account.ACCOUNT_SUSPENDED',
} as const;

// ─── Admin module ───────────────────────────────────────────────────────────
export const AdminKeys = {
  DASHBOARD_FETCHED: 'admin.DASHBOARD_FETCHED',
  USER_LIST_FETCHED: 'admin.USER_LIST_FETCHED',
  USER_UPDATED: 'admin.USER_UPDATED',
  USER_DELETED: 'admin.USER_DELETED',

  ADMIN_NOT_FOUND: 'admin.ADMIN_NOT_FOUND',
  PERMISSION_DENIED: 'admin.PERMISSION_DENIED',
  INVALID_ADMIN_ROLE: 'admin.INVALID_ADMIN_ROLE',
} as const;

// ─── Common (shared) ────────────────────────────────────────────────────────
export const CommonKeys = {
  SERVER_ERROR: 'common.SERVER_ERROR',
  TOKEN_MISSING: 'common.TOKEN_MISSING',
  UNAUTHORIZED: 'common.UNAUTHORIZED',
  FORBIDDEN: 'common.FORBIDDEN',
  NOT_FOUND: 'common.NOT_FOUND',
  BAD_REQUEST: 'common.BAD_REQUEST',
} as const;

// ─── Types ──────────────────────────────────────────────────────────────────
export type ValidationKey = (typeof ValidationKeys)[keyof typeof ValidationKeys];
export type AccountKey = (typeof AccountKeys)[keyof typeof AccountKeys];
export type AdminKey = (typeof AdminKeys)[keyof typeof AdminKeys];
export type CommonKey = (typeof CommonKeys)[keyof typeof CommonKeys];
