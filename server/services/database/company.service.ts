/**
 * Company Database Service
 * Handles all database operations for companies
 */

import { Company, CreateCompanyInput, UpdateCompanyInput } from "~~/types/company";

export class CompanyService {
  /**
   * Find company by ID
   */
  async findById(id: string): Promise<Company | null> {
    try {
      return await prisma.company.findUnique({
        where: { id },
      });
    } catch (error) {
      console.error('Find company by ID error:', error);
      throw new Error('Failed to find company');
    }
  }

  /**
   * Find company by handle
   */
  async findByHandle(handle: string): Promise<Company | null> {
    try {
      return await prisma.company.findUnique({
        where: { handle },
      });
    } catch (error) {
      console.error('Find company by handle error:', error);
      throw new Error('Failed to find company');
    }
  }

  /**
   * Get all companies
   */
  async findAll(): Promise<Company[]> {
    try {
      return await prisma.company.findMany({
        orderBy: {
          createdAt: 'desc',
        },
      });
    } catch (error) {
      console.error('Find all companies error:', error);
      throw new Error('Failed to fetch companies');
    }
  }

  /**
   * Create or update company (upsert)
   */
  async upsert(data: CreateCompanyInput): Promise<Company> {
    try {
      return await prisma.company.upsert({
        where: { id: data.id },
        update: {
          handle: data.handle,
          name: data.name,
          description: data.description,
          logoUrl: data.logoUrl,
          accessToken: data.accessToken,
          authorizationCode: data.authorizationCode,
          phone: data.phone,
          updatedAt: new Date(),
        },
        create: {
          id: data.id,
          handle: data.handle,
          name: data.name,
          description: data.description,
          logoUrl: data.logoUrl,
          accessToken: data.accessToken,
          authorizationCode: data.authorizationCode,
          phone: data.phone,
        },
      });
    } catch (error) {
      console.error('Upsert company error:', error);
      throw new Error('Failed to create/update company');
    }
  }

  /**
   * Update company
   */
  async update(id: string, data: UpdateCompanyInput): Promise<Company> {
    try {
      return await prisma.company.update({
        where: { id },
        data: {
          ...data,
          updatedAt: new Date(),
        },
      });
    } catch (error) {
      console.error('Update company error:', error);
      throw new Error('Failed to update company');
    }
  }

  /**
   * Delete company
   */
  async delete(id: string): Promise<void> {
    try {
      await prisma.company.delete({
        where: { id },
      });
    } catch (error) {
      console.error('Delete company error:', error);
      throw new Error('Failed to delete company');
    }
  }

  /**
   * Update company access token
   */
  async updateAccessToken(id: string, accessToken: string): Promise<Company> {
    try {
      return await prisma.company.update({
        where: { id },
        data: {
          accessToken,
          updatedAt: new Date(),
        },
      });
    } catch (error) {
      console.error('Update access token error:', error);
      throw new Error('Failed to update access token');
    }
  }

  /**
   * Check if company exists
   */
  async exists(id: string): Promise<boolean> {
    try {
      const count = await prisma.company.count({
        where: { id },
      });
      return count > 0;
    } catch (error) {
      console.error('Check company exists error:', error);
      return false;
    }
  }
}
