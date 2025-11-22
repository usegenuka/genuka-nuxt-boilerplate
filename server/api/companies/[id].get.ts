/**
 * Get company by ID
 */

import { CompanyService } from '~/server/services/database/company.service';

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id');

    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        message: 'Company ID is required',
      });
    }

    const companyService = new CompanyService();
    const company = await companyService.findById(id);

    if (!company) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Not Found',
        message: 'Company not found',
      });
    }

    return company;
  } catch (error: any) {
    console.error('Get company error:', error);

    if (error.statusCode) {
      throw error;
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: 'Failed to fetch company',
    });
  }
});
