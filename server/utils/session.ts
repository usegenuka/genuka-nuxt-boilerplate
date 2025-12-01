import type { H3Event } from "h3";
import { SignJWT, jwtVerify, type JWTPayload } from "jose";
import { env } from "~~/config/env";

// Cookie names
const SESSION_COOKIE_NAME = "session";
const REFRESH_COOKIE_NAME = "refresh_session";

// Cookie durations
const SESSION_MAX_AGE = 60 * 60 * 7; // 7 hours in seconds
const REFRESH_MAX_AGE = 60 * 60 * 24 * 30; // 30 days in seconds

interface SessionPayload extends JWTPayload {
  companyId: string;
  type: "session" | "refresh";
}

function getSecret() {
  return new TextEncoder().encode(env.genuka.clientSecret);
}

/**
 * Create both session and refresh cookies for a company
 * Double cookie pattern for secure session management
 */
export async function createSession(event: H3Event, companyId: string) {
  const secret = getSecret();
  const isProd = process.env.NODE_ENV === "production";

  // Create session token (short-lived: 7h)
  const sessionToken = await new SignJWT({ companyId, type: "session" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7h")
    .sign(secret);

  // Create refresh token (long-lived: 30 days)
  const refreshToken = await new SignJWT({ companyId, type: "refresh" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(secret);

  // Set session cookie (7h)
  setCookie(event, SESSION_COOKIE_NAME, sessionToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  });

  // Set refresh cookie (30 days)
  setCookie(event, REFRESH_COOKIE_NAME, refreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    maxAge: REFRESH_MAX_AGE,
    path: "/",
  });

  return sessionToken;
}

/**
 * Verify a JWT token and return the payload
 */
async function verifyJwt(token: string): Promise<SessionPayload | null> {
  try {
    const secret = getSecret();
    const { payload } = await jwtVerify(token, secret);
    return payload as SessionPayload;
  } catch (error) {
    // Don't log expected expiration errors
    const isExpiredError =
      error instanceof Error && error.message.includes("expired");
    if (!isExpiredError) {
      console.error("JWT verification failed:", error);
    }
    return null;
  }
}

/**
 * Get the session token from cookies
 */
function getSessionToken(event: H3Event): string | null {
  return getCookie(event, SESSION_COOKIE_NAME) || null;
}

/**
 * Get the refresh token from cookies
 */
function getRefreshTokenFromCookie(event: H3Event): string | null {
  return getCookie(event, REFRESH_COOKIE_NAME) || null;
}

/**
 * Verify refresh token and return companyId
 * This is used for secure session refresh
 */
export async function verifyRefreshToken(event: H3Event): Promise<string | null> {
  const token = getRefreshTokenFromCookie(event);

  if (!token) {
    return null;
  }

  const payload = await verifyJwt(token);

  // Ensure it's a refresh token, not a session token
  if (!payload || payload.type !== "refresh") {
    return null;
  }

  return payload.companyId;
}

/**
 * Get current company ID from session
 */
export async function getCurrentCompanyId(event: H3Event): Promise<string | null> {
  const token = getSessionToken(event);

  if (!token) {
    return null;
  }

  const payload = await verifyJwt(token);

  if (!payload || payload.type !== "session") {
    return null;
  }

  return payload.companyId;
}

/**
 * Get session data (for backward compatibility)
 */
export async function getCompanySession(event: H3Event): Promise<{ companyId: string } | null> {
  const companyId = await getCurrentCompanyId(event);

  if (!companyId) {
    return null;
  }

  return { companyId };
}

/**
 * Clear both session and refresh cookies
 */
export function clearCompanySession(event: H3Event) {
  deleteCookie(event, SESSION_COOKIE_NAME);
  deleteCookie(event, REFRESH_COOKIE_NAME);
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(event: H3Event): Promise<boolean> {
  const companyId = await getCurrentCompanyId(event);
  return companyId !== null;
}
