import type { Company } from "~~/types/company";

interface CurrentCompanyResponse {
  success: boolean;
  company: Company | null;
  authenticated: boolean;
  message?: string;
}

interface AuthCheckResponse {
  authenticated: boolean;
}

interface RefreshResponse {
  success: boolean;
  message: string;
  company: {
    id: string;
    handle: string | null;
    name: string;
  };
}

// Reactive state shared across all component instances
const state = reactive({
  company: null as Company | null,
  isAuthenticated: false,
  isLoading: false,
  error: null as string | null,
});

export const useGenuka = () => {
  /**
   * Check if the current session is valid
   */
  const checkAuth = async (): Promise<boolean> => {
    try {
      const data = await $fetch<AuthCheckResponse>("/api/auth/check");
      state.isAuthenticated = data.authenticated;
      return data.authenticated;
    } catch {
      state.isAuthenticated = false;
      return false;
    }
  };

  /**
   * Get current authenticated company
   */
  const getCurrentCompany = async (): Promise<Company | null> => {
    state.isLoading = true;
    state.error = null;

    try {
      const data = await $fetch<CurrentCompanyResponse>("/api/company/current");

      if (data.success && data.company) {
        state.company = data.company;
        state.isAuthenticated = true;
        return data.company;
      }

      // If not authenticated, try to refresh
      if (!data.authenticated) {
        const refreshed = await refresh();
        if (refreshed) {
          return state.company;
        }
      }

      state.company = null;
      state.isAuthenticated = false;
      return null;
    } catch (err: any) {
      console.error("Get current company error:", err);
      state.error = err.message || "Failed to get company";
      state.company = null;
      state.isAuthenticated = false;
      return null;
    } finally {
      state.isLoading = false;
    }
  };

  /**
   * Refresh the session using the refresh_session cookie
   * No body required - the cookie is sent automatically
   */
  const refresh = async (): Promise<boolean> => {
    state.isLoading = true;
    state.error = null;

    try {
      await $fetch<RefreshResponse>("/api/auth/refresh", { method: "POST" });

      // Fetch full company info after refresh
      const data = await $fetch<CurrentCompanyResponse>("/api/company/current");

      if (data.success && data.company) {
        state.company = data.company;
        state.isAuthenticated = true;
        return true;
      }

      return false;
    } catch (err: any) {
      state.error =
        err.data?.message || "Session expired. Please reinstall the app.";
      state.company = null;
      state.isAuthenticated = false;
      return false;
    } finally {
      state.isLoading = false;
    }
  };

  /**
   * Logout and destroy the session
   */
  const logout = async (): Promise<void> => {
    state.isLoading = true;
    state.error = null;

    try {
      await $fetch("/api/auth/logout", { method: "POST" });
      state.company = null;
      state.isAuthenticated = false;
    } catch (err: any) {
      state.error = "Failed to logout";
    } finally {
      state.isLoading = false;
    }
  };

  /**
   * Initiate OAuth flow
   * Redirects user to Genuka authorization page
   */
  const initiateOAuth = (companyId: string, redirectTo?: string) => {
    const config = useRuntimeConfig();
    const baseUrl = config.public.genukaUrl || "https://api.genuka.com";
    const clientId = config.public.genukaClientId;
    const redirectUri = config.public.genukaRedirectUri;

    if (!clientId || !redirectUri) {
      console.error("Genuka OAuth not configured");
      return;
    }

    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      company_id: companyId,
      response_type: "code",
      ...(redirectTo && { state: redirectTo }),
    });

    const authUrl = `${baseUrl}/oauth/authorize?${params.toString()}`;
    window.location.href = authUrl;
  };

  /**
   * Check if company is connected (has access token)
   */
  const isCompanyConnected = async (): Promise<boolean> => {
    try {
      const company = await getCurrentCompany();
      return !!company?.accessToken;
    } catch (err) {
      return false;
    }
  };

  return {
    // Reactive state
    company: computed(() => state.company),
    isAuthenticated: computed(() => state.isAuthenticated),
    isLoading: computed(() => state.isLoading),
    error: computed(() => state.error),

    // Methods
    checkAuth,
    getCurrentCompany,
    refresh,
    logout,
    initiateOAuth,
    isCompanyConnected,
  };
};
