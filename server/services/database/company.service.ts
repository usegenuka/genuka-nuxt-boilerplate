import type { Company, CreateCompanyInput, UpdateCompanyInput } from "~~/types/company";

export class CompanyService {

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
}
