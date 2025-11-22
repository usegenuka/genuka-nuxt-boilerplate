/**
 * Centralized environment configuration
 * All environment variables are validated and typed here
 */

export const env = {
  genuka: {
    url: process.env.GENUKA_URL || 'https://api.genuka.com',
    clientId: process.env.GENUKA_CLIENT_ID || '',
    clientSecret: process.env.GENUKA_CLIENT_SECRET || '',
    redirectUri: process.env.GENUKA_REDIRECT_URI || '',
  },
  database: {
    url: process.env.DATABASE_URL || '',
  },
  app: {
    env: process.env.NODE_ENV || 'development',
    url: process.env.APP_URL || 'http://localhost:3000',
  },
} as const;

/**
 * Validate required environment variables
 * Throws error if any required variable is missing
 */
export function validateEnv(): void {
  const required = {
    'GENUKA_CLIENT_ID': env.genuka.clientId,
    'GENUKA_CLIENT_SECRET': env.genuka.clientSecret,
    'GENUKA_REDIRECT_URI': env.genuka.redirectUri,
    'DATABASE_URL': env.database.url,
  };

  const missing = Object.entries(required)
    .filter(([_, value]) => !value)
    .map(([key]) => key);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
      'Please check your .env file.'
    );
  }
}
