import { CompanyService } from "~~/server/services/database/company.service";
import { refreshAccessToken } from "~~/server/utils/genuka";
import { createSession, verifyRefreshToken } from "~~/server/utils/session";

export default defineEventHandler(async (event) => {
  try {
    // Verify the refresh token from HTTP-only cookie
    const companyId = await verifyRefreshToken(event);

    if (!companyId) {
      throw createError({
        statusCode: 401,
        statusMessage: "Unauthorized",
        message: "Invalid or expired refresh token. Please reinstall the app.",
      });
    }

    // Check if company exists in database with a Genuka refresh token
    const companyService = new CompanyService();
    const company = await prisma.company.findUnique({
      where: { id: companyId },
    });

    if (!company || !company.refreshToken) {
      throw createError({
        statusCode: 401,
        statusMessage: "Unauthorized",
        message:
          "Company not found or no refresh token available. Please reinstall the app.",
      });
    }

    // Use Genuka refresh_token to get new tokens from Genuka API
    const tokenResponse = await refreshAccessToken(company.refreshToken);

    // Calculate new expiration date
    const tokenExpiresAt = new Date(
      Date.now() + tokenResponse.expires_in_minutes * 60 * 1000,
    );

    // Update Genuka tokens in database
    await companyService.update(companyId, {
      accessToken: tokenResponse.access_token,
      refreshToken: tokenResponse.refresh_token,
      tokenExpiresAt: tokenExpiresAt,
    });

    // Create new session + refresh cookies
    await createSession(event, companyId);

    return {
      success: true,
      message: "Session refreshed successfully",
      company: {
        id: company.id,
        handle: company.handle,
        name: company.name,
      },
    };
  } catch (error: any) {
    console.error("Session refresh error:", error);

    // If refresh token is invalid/revoked, user needs to reinstall
    const message = error.message || "Failed to refresh session";
    const isTokenError =
      message.includes("revoked") || message.includes("invalid");

    throw createError({
      statusCode: isTokenError ? 401 : error.statusCode || 500,
      statusMessage: isTokenError ? "Unauthorized" : "Server Error",
      message: isTokenError
        ? "Refresh token is invalid or revoked. Please reinstall the app."
        : message,
    });
  }
});
