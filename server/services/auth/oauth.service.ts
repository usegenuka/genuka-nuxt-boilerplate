import type { OAuthCallbackParams } from '~~/types/company';
import { exchangeCodeForToken, getCompanyInfo } from '~~/server/utils/genuka';
import { verifyHmac, isTimestampValid } from '~~/server/utils/hmac';

export class OAuthService {
  
  async handleCallback(params: OAuthCallbackParams): Promise<void> {
    const { code, company_id, timestamp, hmac } = params;

    await this.validateHmac(params);

    const accessToken = await exchangeCodeForToken(code);

    const companyInfo = await getCompanyInfo(company_id);

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

  
  private async validateHmac(params: OAuthCallbackParams): Promise<void> {
    // Check if HMAC exists
    if (!params.hmac) {
      throw new Error('HMAC signature is required');
    }

    if (!isTimestampValid(params.timestamp)) {
      throw new Error('Request expired - timestamp too old');
    }

    const isValid = await verifyHmac(
      {
        code: params.code,
        company_id: params.company_id,
        redirect_to: params.redirect_to,
        timestamp: params.timestamp,
      },
      params.hmac
    );

    if (!isValid) {
      throw new Error('Invalid HMAC signature');
    }
  }

}
