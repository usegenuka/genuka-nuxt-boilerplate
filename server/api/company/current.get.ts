import { getCurrentCompanyId } from '~~/server/utils/session';
import { getCompanyInfo } from '~~/server/utils/genuka';

export default defineEventHandler(async (event) => {
  try {
    // Get company ID from session (async - verifies JWT)
    const companyId = await getCurrentCompanyId(event);

    if (!companyId) {
      return {
        success: false,
        company: null,
        authenticated: false,
      };
    }

    // Fetch company info from Genuka API using SDK
    const company = await getCompanyInfo(companyId);

    if (!company) {
      return {
        success: false,
        company: null,
        authenticated: false,
        message: 'Company not found',
      };
    }

    return {
      success: true,
      company,
      authenticated: true,
    };
  } catch (error: any) {
    console.error('Get current company error:', error);

    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: 'Failed to fetch company',
    });
  }
});
