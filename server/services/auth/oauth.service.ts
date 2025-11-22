/**
 * OAuth Service
 * Handles OAuth flow, token exchange, and company synchronization
 */

import type { OAuthCallbackParams, GenukaCompanyInfo } from '~~/types/company';
import { exchangeCodeForToken, getCompanyInfo } from '~~/server/utils/genuka';

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
    const accessToken = await exchangeCodeForToken(code);

    // Fetch company information from Genuka
    const companyInfo = await getCompanyInfo(company_id);

    // Store/update company in database
    const companyService = new (await import('~~/server/services/database/company.service')).CompanyService();
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

}
