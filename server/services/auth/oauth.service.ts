/**
 * OAuth Service
 * Handles OAuth flow, token exchange, and company synchronization
 */

import type { OAuthCallbackParams, TokenResponse, GenukaCompanyInfo } from '../../../types/company';
import { env } from '../../../config/env';
import { OAUTH_ENDPOINTS, TOKEN_GRANT_TYPES } from '../../../config/constants';

export class OAuthService {
  /**
   * Handle OAuth callback
   * Validates params, exchanges code for token, and syncs company data
   */
  async handleCallback(params: OAuthCallbackParams): Promise<void> {
    const { code, company_id, timestamp, hmac } = params;

    // Validate HMAC signature
    this.validateHmac(params);

    // Exchange authorization code for access token
    const accessToken = await this.exchangeCodeForToken(code);

    // Fetch company information from Genuka
    const companyInfo = await this.fetchCompanyInfo(company_id, accessToken);

    // Store/update company in database
    const companyService = new (await import('../database/company.service')).CompanyService();
    await companyService.upsert({
      id: company_id,
      handle: companyInfo.handle || null,
      name: companyInfo.name,
      description: companyInfo.description || null,
      logoUrl: companyInfo.logoUrl || null,
      accessToken: accessToken,
      authorizationCode: code,
      phone: companyInfo.metadata?.contact || null,
    });
  }

  /**
   * Exchange authorization code for access token
   */
  private async exchangeCodeForToken(code: string): Promise<string> {
    const tokenUrl = `${env.genuka.url}${OAUTH_ENDPOINTS.TOKEN}`;

    const body = new URLSearchParams({
      grant_type: TOKEN_GRANT_TYPES.AUTHORIZATION_CODE,
      code: code,
      client_id: env.genuka.clientId,
      client_secret: env.genuka.clientSecret,
      redirect_uri: env.genuka.redirectUri,
    });

    try {
      const response = await fetch(tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: body.toString(),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Token exchange failed: ${response.status} - ${errorText}`);
      }

      const data: TokenResponse = await response.json();
      return data.access_token;
    } catch (error) {
      console.error('Token exchange error:', error);
      throw new Error('Failed to exchange authorization code for access token');
    }
  }

  /**
   * Fetch company information from Genuka API
   */
  private async fetchCompanyInfo(companyId: string, accessToken: string): Promise<GenukaCompanyInfo> {
    // TODO: Replace with actual Genuka SDK once available
    // For now, we'll use a direct API call
    const companyUrl = `${env.genuka.url}/api/companies/${companyId}`;

    try {
      const response = await fetch(companyUrl, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch company info: ${response.status}`);
      }

      const data: GenukaCompanyInfo = await response.json();
      return data;
    } catch (error) {
      console.error('Fetch company info error:', error);
      throw new Error('Failed to fetch company information');
    }
  }

  /**
   * Validate HMAC signature
   * Ensures the request is authentic and from Genuka
   */
  private validateHmac(params: OAuthCallbackParams): void {
    // TODO: Implement HMAC validation
    // This should verify that the request came from Genuka
    // For now, we'll just check if the hmac exists
    if (!params.hmac) {
      throw new Error('HMAC signature is required');
    }

    // Example implementation:
    // const message = `${params.code}${params.company_id}${params.timestamp}`;
    // const signature = crypto
    //   .createHmac('sha256', env.genuka.clientSecret)
    //   .update(message)
    //   .digest('hex');
    //
    // if (signature !== params.hmac) {
    //   throw new Error('Invalid HMAC signature');
    // }
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshToken(refreshToken: string): Promise<string> {
    const tokenUrl = `${env.genuka.url}${OAUTH_ENDPOINTS.TOKEN}`;

    const body = new URLSearchParams({
      grant_type: TOKEN_GRANT_TYPES.REFRESH_TOKEN,
      refresh_token: refreshToken,
      client_id: env.genuka.clientId,
      client_secret: env.genuka.clientSecret,
    });

    try {
      const response = await fetch(tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: body.toString(),
      });

      if (!response.ok) {
        throw new Error(`Token refresh failed: ${response.status}`);
      }

      const data: TokenResponse = await response.json();
      return data.access_token;
    } catch (error) {
      console.error('Token refresh error:', error);
      throw new Error('Failed to refresh access token');
    }
  }
}
