// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  runtimeConfig: {
    // Private keys (only available server-side)
    genukaClientSecret: process.env.GENUKA_CLIENT_SECRET,
    databaseUrl: process.env.DATABASE_URL,

    // Public keys (exposed to client)
    public: {
      genukaUrl: process.env.GENUKA_URL || 'https://api.genuka.com',
      genukaClientId: process.env.GENUKA_CLIENT_ID,
      genukaRedirectUri: process.env.GENUKA_REDIRECT_URI,
    }
  },

  // TypeScript configuration
  typescript: {
    strict: true
  }
})
