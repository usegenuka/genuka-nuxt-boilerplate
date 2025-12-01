import Genuka from 'genuka-api';
import { env } from '~~/config/env';
import type { TokenResponse } from '~~/types/company';

export async function initializeGenuka(companyId: string) {
  return await Genuka.initialize({ id: companyId });
}

export async function exchangeCodeForToken(code: string): Promise<TokenResponse> {
  const body = new URLSearchParams();
  body.append('grant_type', 'authorization_code');
  body.append('code', code);
  body.append('client_id', env.genuka.clientId!);
  body.append('client_secret', env.genuka.clientSecret!);
  body.append('redirect_uri', env.genuka.redirectUri!);

  const tokenResponse = await fetch(`${env.genuka.url}/oauth/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
  });

  if (!tokenResponse.ok) {
    const errorText = await tokenResponse.text();
    throw new Error(`Token exchange failed: ${tokenResponse.status} ${errorText}`);
  }

  return (await tokenResponse.json()) as TokenResponse;
}

export async function refreshAccessToken(refreshToken: string): Promise<TokenResponse> {
  const response = await fetch(`${env.genuka.url}/oauth/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      refresh_token: refreshToken,
      client_id: env.genuka.clientId,
      client_secret: env.genuka.clientSecret,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Token refresh failed: ${response.status} ${errorText}`);
  }

  return (await response.json()) as TokenResponse;
}

export async function getCompanyInfo(companyId: string) {
  const genuka = await initializeGenuka(companyId);
  return await genuka.company.retrieve();
}
