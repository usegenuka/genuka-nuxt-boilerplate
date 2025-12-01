export interface Company {
  id: string;
  handle: string | null;
  name: string;
  description: string | null;
  logoUrl: string | null;
  accessToken: string | null;
  refreshToken: string | null;
  tokenExpiresAt: Date | null;
  authorizationCode: string | null;
  phone: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCompanyInput {
  id: string;
  handle?: string | null;
  name: string;
  description?: string | null;
  logoUrl?: string | null;
  accessToken?: string | null;
  refreshToken?: string | null;
  tokenExpiresAt?: Date | null;
  authorizationCode?: string | null;
  phone?: string | null;
}

export interface UpdateCompanyInput {
  handle?: string | null;
  name?: string;
  description?: string | null;
  logoUrl?: string | null;
  accessToken?: string | null;
  refreshToken?: string | null;
  tokenExpiresAt?: Date | null;
  authorizationCode?: string | null;
  phone?: string | null;
}

export interface OAuthCallbackParams {
  code: string;
  company_id: string;
  timestamp: string;
  hmac: string;
  redirect_to: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in_minutes: number;
}

export interface GenukaCompanyInfo {
  id: string;
  handle?: string;
  name: string;
  description?: string;
  logoUrl?: string;
  metadata?: {
    contact?: string;
    [key: string]: any;
  };
}

export interface WebhookEvent {
  type: string;
  data: any;
  timestamp: string;
  company_id: string;
}
