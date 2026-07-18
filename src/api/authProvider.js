/**
 * Auth credential provider — the ONLY place that knows HOW auth tokens
 * are attached to requests and how they are read from responses.
 *
 * CURRENT MODE: cookie-based (PHP session cookie from OpenCart backend)
 *
 * HOW TO SWITCH TO JWT (future):
 *   1. Set AUTH_MODE = 'jwt' below.
 *   2. Backend: make mobile/auth.login return { access_token, refresh_token, expires_in }
 *      instead of relying on Set-Cookie.
 *   3. getAuthHeaders() already handles 'jwt' — it will return Authorization: Bearer header.
 *   4. apiclient.ts response interceptor: call extractSessionCredentials() to store tokens.
 *   5. Add token refresh: in the 401 interceptor, call refreshAccessToken() before retrying.
 *   6. authSlice: setSession() already has accessToken/refreshToken/tokenExpiry fields ready.
 *   No other files need to change.
 */

export const AUTH_MODE = 'cookie'; // 'cookie' | 'jwt'

/**
 * Returns headers to merge into every outgoing request.
 * Called by the apiclient request interceptor.
 *
 * @param {object} authState - Redux auth slice state
 * @returns {object} headers object (may be empty if not authenticated)
 */
export const getAuthHeaders = (authState) => {
  if (AUTH_MODE === 'jwt') {
    if (!authState.accessToken) return {};
    return { Authorization: `Bearer ${authState.accessToken}` };
  }
  // cookie mode: attach the PHP session cookie captured on login
  if (!authState.sessionCookie) return {};
  return { Cookie: authState.sessionCookie };
};

/**
 * Returns true if the response signals that the session/token has expired.
 * apiclient uses this to dispatch clearSession() and redirect to login.
 *
 * @param {object} response - Axios response object
 */
export const isAuthExpired = (response) => {
  if (!response) return false;
  if (AUTH_MODE === 'jwt') {
    return response.status === 401;
  }
  // cookie mode: OpenCart session expiry manifests as a redirect JSON key
  const data = response.data;
  return (
    typeof data?.redirect === 'string' &&
    data.redirect.includes('account/login')
  );
};

/**
 * Extracts the PHP session cookie string from a Set-Cookie header value.
 * Returns null if the header is absent or does not contain a PHPSESSID.
 *
 * Only relevant in cookie mode; ignored when AUTH_MODE = 'jwt'.
 *
 * @param {string|string[]|undefined} setCookieHeader
 * @returns {string|null}
 */
export const extractSessionCookie = (setCookieHeader) => {
  if (!setCookieHeader) return null;
  const raw = Array.isArray(setCookieHeader) ? setCookieHeader[0] : setCookieHeader;
  const match = raw?.match(/PHPSESSID=[^;]+/);
  return match ? match[0] : null;
};
