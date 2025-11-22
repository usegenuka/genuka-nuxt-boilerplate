import type { H3Event } from 'h3';

interface SessionData {
  companyId: string;
  createdAt: number;
}

const SESSION_COOKIE_NAME = 'genuka_session';
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 jours

/**
 * Create a session for a company
 */
export async function createSession(event: H3Event, companyId: string) {
  const sessionData: SessionData = {
    companyId,
    createdAt: Date.now(),
  };

  setCookie(event, SESSION_COOKIE_NAME, JSON.stringify(sessionData), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_MAX_AGE,
    path: '/',
  });
}

/**
 * Get session data from cookie
 */
export function getCompanySession(event: H3Event): SessionData | null {
  const sessionCookie = getCookie(event, SESSION_COOKIE_NAME);

  if (!sessionCookie) {
    return null;
  }

  try {
    return JSON.parse(sessionCookie) as SessionData;
  } catch (error) {
    console.error('Failed to parse session cookie:', error);
    return null;
  }
}

/**
 * Get current company ID from session
 */
export function getCurrentCompanyId(event: H3Event): string | null {
  const session = getCompanySession(event);
  return session?.companyId || null;
}

/**
 * Clear session
 */
export function clearCompanySession(event: H3Event) {
  deleteCookie(event, SESSION_COOKIE_NAME);
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(event: H3Event): boolean {
  return getCompanySession(event) !== null;
}
