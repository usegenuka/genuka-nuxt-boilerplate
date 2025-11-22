import { getCurrentCompanyId } from '~~/server/utils/session';

export default defineEventHandler(async (event) => {
  try {
    // Get company ID from session
    const companyId = getCurrentCompanyId(event);

    if (!companyId) {
      return {
        success: false,
        company: null,
        authenticated: false,
      };
    }

    // Fetch company from database
    const company = await prisma.company.findUnique({
      where: { id: companyId },
      select: {
        id: true,
        handle: true,
        name: true,
        description: true,
        logoUrl: true,
        phone: true,
        createdAt: true,
        updatedAt: true,
      },
    });

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
