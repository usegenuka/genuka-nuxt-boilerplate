/**
 * Test script to verify imports are working correctly
 */

import { env } from '../config/env';
import { OAUTH_ENDPOINTS } from '../config/constants';

console.log('✅ Config imports working!');
console.log('Genuka URL:', env.genuka.url);
console.log('OAuth Token Endpoint:', OAUTH_ENDPOINTS.TOKEN);

// Test Prisma import
import { prisma } from '../server/utils/prisma';
console.log('✅ Prisma import working!');

console.log('\n🎉 All imports are working correctly!');
