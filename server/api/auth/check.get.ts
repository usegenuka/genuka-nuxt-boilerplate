import { isAuthenticated } from "~~/server/utils/session";

export default defineEventHandler(async (event) => {
  try {
    const authenticated = await isAuthenticated(event);

    return {
      authenticated,
    };
  } catch (error: any) {
    console.error("Auth check error:", error);
    return {
      authenticated: false,
    };
  }
});
