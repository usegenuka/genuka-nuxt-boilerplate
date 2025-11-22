export const env = {
  genuka: {
    url: process.env.GENUKA_URL || "https://api.genuka.com",
    clientId: process.env.GENUKA_CLIENT_ID,
    clientSecret: process.env.GENUKA_CLIENT_SECRET,
    redirectUri: process.env.GENUKA_REDIRECT_URI,
  },
  database: {
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "3306"),
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD,
    name: process.env.DB_NAME,
    url: process.env.DATABASE_URL,
  },
  app: {
    env: process.env.NODE_ENV,
    url: process.env.APP_URL,
  },
} as const;

export function validateEnv(): void {
  const required = {
    GENUKA_CLIENT_ID: env.genuka.clientId,
    GENUKA_CLIENT_SECRET: env.genuka.clientSecret,
    GENUKA_REDIRECT_URI: env.genuka.redirectUri,
    DB_HOST: env.database.host,
    DB_PORT: env.database.port,
    DB_USER: env.database.user,
    DB_PASSWORD: env.database.password,
    DB_NAME: env.database.name,
    DATABASE_URL: env.database.url,
  };

  const missing = Object.entries(required)
    .filter(([_, value]) => !value)
    .map(([key]) => key);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}\n` +
        "Please check your .env file."
    );
  }
}
