import { getCurrentCompanyId } from "~~/server/utils/session";

export default defineEventHandler(async (event) => {
  try {
    const companyId = await getCurrentCompanyId(event);

    if (!companyId) {
      throw createError({
        statusCode: 401,
        statusMessage: "Unauthorized",
        message: "Not authenticated",
      });
    }

    const company = await prisma.company.findUnique({
      where: { id: companyId },
    });

    if (!company) {
      throw createError({
        statusCode: 401,
        statusMessage: "Unauthorized",
        message: "Company not found",
      });
    }

    // Return company info without sensitive data
    return {
      id: company.id,
      handle: company.handle,
      name: company.name,
      description: company.description,
      logoUrl: company.logoUrl,
      phone: company.phone,
      createdAt: company.createdAt,
      updatedAt: company.updatedAt,
    };
  } catch (error: any) {
    console.error("Auth me error:", error);

    if (error.statusCode) {
      throw error;
    }

    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
      message: "Failed to get user info",
    });
  }
});
