/**
 * Nitro plugin to configure SSL for development
 */

export default defineNitroPlugin((nitroApp) => {
  if (process.env.NODE_ENV === 'development' && process.env.GENUKA_URL?.includes('.test')) {
    // Disable SSL verification for local .test domains only
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    console.log('⚠️  SSL verification disabled for local .test domain (development only)');
  }
});
