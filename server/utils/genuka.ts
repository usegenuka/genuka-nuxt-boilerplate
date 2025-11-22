/**
 * Genuka SDK utilities and helpers
 * Provides reusable functions for interacting with the Genuka API
 */

import Genuka from 'genuka-api';
import { env } from '~~/config/env';

/**
 * Initialize Genuka SDK with company ID
 */
export async function initializeGenuka(companyId: string) {
  return await Genuka.initialize({ id: companyId });
}

/**
 * Exchange OAuth authorization code for access token
 */
export async function exchangeCodeForToken(code: string) {
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

  const data = await tokenResponse.json();
  return data.access_token as string;
}

/**
 * Retrieve company information from Genuka
 */
export async function getCompanyInfo(companyId: string) {
  const genuka = await initializeGenuka(companyId);
  return await genuka.company.retrieve();
}
