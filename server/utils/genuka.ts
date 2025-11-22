import Genuka from 'genuka-api';
import { env } from '~~/config/env';

export async function initializeGenuka(companyId: string) {
  return await Genuka.initialize({ id: companyId });
}

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

export async function getCompanyInfo(companyId: string) {
  const genuka = await initializeGenuka(companyId);
  return await genuka.company.retrieve();
}
