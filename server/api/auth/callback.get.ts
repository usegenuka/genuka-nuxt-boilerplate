import { OAuthService } from "~~/server/services/auth/oauth.service";
import type { OAuthCallbackParams } from "~~/types/company";
import { createSession } from "~~/server/utils/session";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const { code, company_id, timestamp, hmac, redirect_to } = query;

    // Validate required parameters
    if (!code || !company_id || !timestamp || !hmac || !redirect_to) {
      throw createError({
        statusCode: 400,
        statusMessage: "Bad Request",
        message:
          "Missing required parameters: code, company_id, timestamp, hmac, and redirect_to are required",
      });
    }

    // Prepare callback parameters
    const params: OAuthCallbackParams = {
      code: code as string,
      company_id: company_id as string,
      timestamp: timestamp as string,
      hmac: hmac as string,
      redirect_to: redirect_to as string,
    };

    // Process OAuth callback
    const oauthService = new OAuthService();
    await oauthService.handleCallback(params);

    // Create session for the company
    await createSession(event, params.company_id);

    // Decode and prepare redirect URL
    const redirectUrl = decodeURIComponent(params.redirect_to);

    console.log("OAuth callback successful:", {
      companyId: company_id,
      timestamp: timestamp,
      redirectUrl: redirectUrl,
    });
    return sendRedirect(event, redirectUrl, 302);
  } catch (error: any) {
    console.error("OAuth callback error:", {
      message: error.message,
      statusCode: error.statusCode,
    });

    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: "Internal Server Error",
      message: error.message || "An error occurred during OAuth callback",
    });
  }
});
