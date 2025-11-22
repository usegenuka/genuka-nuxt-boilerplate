/**
 * Get all companies
 */

import { CompanyService } from '../../services/database/company.service';

export default defineEventHandler(async (event) => {
  try {
    const companyService = new CompanyService();
    const companies = await companyService.findAll();

    return companies;
  } catch (error: any) {
    console.error('Get companies error:', error);

    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: 'Failed to fetch companies',
    });
  }
});
