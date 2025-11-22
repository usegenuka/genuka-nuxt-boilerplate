/**
 * Application constants
 */

export const OAUTH_ENDPOINTS = {
  TOKEN: '/oauth/token',
  AUTHORIZE: '/oauth/authorize',
} as const;

export const API_ENDPOINTS = {
  CALLBACK: '/api/auth/callback',
  WEBHOOK: '/api/auth/webhook',
} as const;

export const DEFAULT_REDIRECTS = {
  SUCCESS: '/dashboard',
  ERROR: '/error',
} as const;

export const TOKEN_GRANT_TYPES = {
  AUTHORIZATION_CODE: 'authorization_code',
  REFRESH_TOKEN: 'refresh_token',
} as const;

export const WEBHOOK_EVENTS = {
  COMPANY_UPDATED: 'company.updated',
  COMPANY_DELETED: 'company.deleted',
  ORDER_CREATED: 'order.created',
  ORDER_UPDATED: 'order.updated',
  PRODUCT_CREATED: 'product.created',
  PRODUCT_UPDATED: 'product.updated',
} as const;
