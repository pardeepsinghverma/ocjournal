import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { API_DOMAIN, STOREFRONT_APP_KEY } from './const';
import { getAuthHeaders, isAuthExpired, extractSessionCookie } from './authProvider';
import store from '../store/store';
import { setSessionCookie, clearSession } from '../store/authSlice';

interface ApiRequestParams {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  data?: Record<string, any> | null;
  params?: Record<string, any> | null;
  headers?: Record<string, string>;
}

interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  status?: number;
}

/**
 * Shared Axios instance — created once so interceptors only register once.
 *
 * Interceptors handle two cross-cutting concerns so individual API functions
 * don't have to think about them:
 *
 *   Request:  attach X-OC-Storefront-App + auth credentials (cookie or JWT).
 *             Auth logic lives entirely in authProvider.js — swap AUTH_MODE
 *             there to switch from cookie to JWT without touching this file.
 *
 *   Response: (a) capture renewed Set-Cookie and persist to Redux;
 *             (b) detect session/token expiry and dispatch clearSession().
 */
const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_DOMAIN,
  timeout: 10000,
});

// ── Request interceptor ──────────────────────────────────────────────────────
axiosInstance.interceptors.request.use((config) => {
  // Storefront content-negotiation header (makes catalog URLs return JSON).
  config.headers['X-OC-Storefront-App'] = STOREFRONT_APP_KEY;

  // Auth credentials — delegate to authProvider so the mechanism is swappable.
  const authState = store.getState().auth;
  Object.assign(config.headers, getAuthHeaders(authState));

  return config;
});

// ── Response interceptor ─────────────────────────────────────────────────────
axiosInstance.interceptors.response.use(
  (response) => {
    // Cookie mode: persist any refreshed PHPSESSID that arrives on any response.
    const cookie = extractSessionCookie(response.headers['set-cookie']);
    if (cookie) store.dispatch(setSessionCookie(cookie));

    // Auth expiry detection (works for both cookie redirects and JWT 401s).
    if (isAuthExpired(response)) store.dispatch(clearSession());

    return response;
  },
  (error) => {
    // Hard 401 — JWT mode mainly, but also guards against unexpected 401s.
    if (error.response?.status === 401) store.dispatch(clearSession());
    return Promise.reject(error);
  },
);

/**
 * Performs an API request using the shared Axios instance.
 * Extra headers passed via the `headers` param are merged on top of the
 * interceptor-added ones — use this for one-off overrides, not for auth.
 */
const apiRequest = async <T>({
  url,
  method = 'GET',
  data = null,
  params = null,
  headers = {},
}: ApiRequestParams): Promise<ApiResponse<T>> => {
  try {
    const config: AxiosRequestConfig = { url, method, data, params, headers };
    const response: AxiosResponse<T> = await axiosInstance(config);
    return { data: response.data };
  } catch (error: any) {
    if (axios.isCancel(error)) return { error: 'Request canceled' };
    if (error.response) return { error: error.response.data || 'Server error', status: error.response.status };
    if (error.request)  return { error: 'No response from server' };
    return { error: error.message || 'Something went wrong' };
  }
};

export default apiRequest;
