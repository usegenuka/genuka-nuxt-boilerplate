import { clearCompanySession } from "~~/server/utils/session";

export default defineEventHandler(async (event) => {
  try {
    clearCompanySession(event);

    return {
      success: true,
      message: "Logged out successfully",
    };
  } catch (error: any) {
    console.error("Logout error:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
      message: "Failed to logout",
    });
  }
});
