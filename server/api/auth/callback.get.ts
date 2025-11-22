/**
 * OAuth Callback Endpoint
 * Handles the OAuth authorization callback from Genuka
 *
 * Query Parameters:
 * - code: Authorization code from Genuka
 * - company_id: Genuka company ID
 * - timestamp: Request timestamp
 * - hmac: Request signature for validation
 * - redirect_to: Optional redirect URL after success
 */

import { DEFAULT_REDIRECTS } from "~~/config/constants";
import { OAuthService } from "~~/server/services/auth/oauth.service";
import { OAuthCallbackParams } from "~~/types/company";

export default defineEventHandler(async (event) => {
  try {
    // Get query parameters
    const query = getQuery(event);
    const { code, company_id, timestamp, hmac, redirect_to } = query;

    // Validate required parameters
    if (!code || !company_id || !timestamp || !hmac) {
      throw createError({
        statusCode: 400,
        statusMessage: "Bad Request",
        message:
          "Missing required parameters: code, company_id, timestamp, and hmac are required",
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
