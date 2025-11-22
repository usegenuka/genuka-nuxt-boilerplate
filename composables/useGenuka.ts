import type { Company } from '~~/types/company';

interface CurrentCompanyResponse {
  success: boolean;
  company: Company | null;
  authenticated: boolean;
  message?: string;
}

export const useGenuka = () => {
  /**
   * Get current authenticated company
   */
  const getCurrentCompany = async (): Promise<Company | null> => {
    try {
      const { data, error } = await useFetch<CurrentCompanyResponse>('/api/company/current');

      if (error.value) {
        console.error('Failed to fetch current company:', error.value);
        return null;
      }

      return data.value?.company || null;
    } catch (err: any) {
      console.error('Get current company error:', err);
      return null;
    }
  };

  /**
   * Initiate OAuth flow
   * Redirects user to Genuka authorization page
   */
  const initiateOAuth = (companyId: string, redirectTo?: string) => {
    const config = useRuntimeConfig();
    const baseUrl = config.public.genukaUrl || 'https://api.genuka.com';
    const clientId = config.public.genukaClientId;
    const redirectUri = config.public.genukaRedirectUri;

    if (!clientId || !redirectUri) {
      console.error('Genuka OAuth not configured');
      return;
    }

    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      company_id: companyId,
      response_type: 'code',
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
    getCurrentCompany,
    initiateOAuth,
    isCompanyConnected,
  };
};
