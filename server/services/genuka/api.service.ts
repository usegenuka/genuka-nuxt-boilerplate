/**
 * Genuka API Service
 * Helper service for interacting with Genuka API
 */

import { env } from "~~/config/env";
import { GenukaCompanyInfo } from "~~/types/company";

export class GenukaApiService {
  private baseUrl: string;
  private accessToken: string;

  constructor(accessToken: string) {
    this.baseUrl = env.genuka.url;
    this.accessToken = accessToken;
  }

  /**
   * Make authenticated request to Genuka API
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Genuka API error: ${response.status} - ${errorText}`);
    }

    return response.json();
  }

  /**
   * Get company information
   */
  async getCompany(companyId: string): Promise<GenukaCompanyInfo> {
    return this.request<GenukaCompanyInfo>(`/api/companies/${companyId}`);
  }

  /**
   * Update company information
   */
  async updateCompany(companyId: string, data: Partial<GenukaCompanyInfo>): Promise<GenukaCompanyInfo> {
    return this.request<GenukaCompanyInfo>(`/api/companies/${companyId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  /**
   * Get products
   */
  async getProducts(companyId: string, params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<any> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.set('page', params.page.toString());
    if (params?.limit) queryParams.set('limit', params.limit.toString());
    if (params?.search) queryParams.set('search', params.search);

    const query = queryParams.toString();
    const endpoint = `/api/companies/${companyId}/products${query ? `?${query}` : ''}`;

    return this.request(endpoint);
  }

  /**
   * Get orders
   */
  async getOrders(companyId: string, params?: {
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<any> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.set('page', params.page.toString());
    if (params?.limit) queryParams.set('limit', params.limit.toString());
    if (params?.status) queryParams.set('status', params.status);

    const query = queryParams.toString();
    const endpoint = `/api/companies/${companyId}/orders${query ? `?${query}` : ''}`;

    return this.request(endpoint);
  }

  /**
   * Create product
   */
  async createProduct(companyId: string, productData: any): Promise<any> {
    return this.request(`/api/companies/${companyId}/products`, {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  }

  /**
   * Update product
   */
  async updateProduct(companyId: string, productId: string, productData: any): Promise<any> {
    return this.request(`/api/companies/${companyId}/products/${productId}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  }

  /**
   * Delete product
   */
  async deleteProduct(companyId: string, productId: string): Promise<void> {
    await this.request(`/api/companies/${companyId}/products/${productId}`, {
      method: 'DELETE',
    });
  }
}
