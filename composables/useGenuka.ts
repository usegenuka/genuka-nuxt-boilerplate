/**
 * Genuka Composable
 * Frontend composable for accessing Genuka functionality
 */

import type { Company } from '~/types/company';

export const useGenuka = () => {
  /**
   * Get all companies
   */
  const getCompanies = async (): Promise<Company[]> => {
    try {
      const { data, error } = await useFetch<Company[]>('/api/companies');

      if (error.value) {
        throw new Error(error.value.message || 'Failed to fetch companies');
      }

      return data.value || [];
    } catch (err: any) {
      console.error('Get companies error:', err);
      throw err;
    }
  };

  /**
   * Get company by ID
   */
  const getCompany = async (companyId: string): Promise<Company | null> => {
    try {
      const { data, error } = await useFetch<Company>(`/api/companies/${companyId}`);

      if (error.value) {
        throw new Error(error.value.message || 'Failed to fetch company');
      }

      return data.value;
    } catch (err: any) {
      console.error('Get company error:', err);
      throw err;
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
  const isCompanyConnected = async (companyId: string): Promise<boolean> => {
    try {
      const company = await getCompany(companyId);
      return !!company?.accessToken;
    } catch (err) {
      return false;
    }
  };

  return {
    getCompanies,
    getCompany,
    initiateOAuth,
    isCompanyConnected,
  };
};
