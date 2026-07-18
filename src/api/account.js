/**
 * Account API — login, register, logout, profile, addresses, orders.
 *
 * All functions return { success: boolean, error?: string, ...data }.
 *
 * AUTH SWITCH NOTE:
 *   To migrate from cookie-based to JWT auth, change AUTH_MODE in authProvider.js.
 *   The function signatures and Redux dispatch calls here stay the same;
 *   only the credential fields inside setSession() payload change
 *   (sessionCookie → accessToken/refreshToken/tokenExpiry).
 */
import apiRequest from './apiclient';
import { STOREFRONT_ROUTE } from './const';
import store from '../store/store';
import { setSession, clearSession } from '../store/authSlice';

const route = (name) => `${STOREFRONT_ROUTE}${name}`;

// Extracts a clean, human-readable error string from whatever the API returned.
// Guards against HTML error pages (OC 500/404 returns HTML, not JSON).
const extractError = (data, networkError, fallback = 'Something went wrong.') => {
  // Network / timeout error from apiRequest
  if (networkError && typeof networkError === 'string') {
    if (networkError.includes('<html') || networkError.includes('<!DOCTYPE')) return fallback;
    return networkError;
  }
  // Structured OC error object: { error: { warning: '...' } } or { error: '...' }
  if (data?.error) {
    if (typeof data.error === 'string') return data.error;
    if (typeof data.error === 'object') return data.error.warning || data.error.message || fallback;
  }
  return fallback;
};

// ── Auth ─────────────────────────────────────────────────────────────────────

/**
 * Log in with email + password.
 *
 * On success, dispatches setSession() to Redux — the session cookie is
 * already captured by the apiclient response interceptor (Set-Cookie header),
 * so we only need to store the user data + customerToken here.
 *
 * JWT SWITCH: change route to your JWT endpoint; destructure access_token /
 * refresh_token / expires_in from data instead of customer_token, and pass
 * them as { accessToken, refreshToken, tokenExpiry } to setSession().
 *
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const login = async (email, password) => {
  const { data, error } = await apiRequest({
    url: route('mobile/auth.login'),
    method: 'POST',
    data: { email, password },
  });

  if (error || !data?.success) {
    return { success: false, error: extractError(data, error, 'Login failed. Check your credentials and try again.') };
  }

  store.dispatch(setSession({
    user: {
      firstname: data.firstname,
      lastname:  data.lastname,
      email:     data.email,
      telephone: data.telephone,
    },
    customerId:    data.customer_id,
    customerToken: data.customer_token,
    // sessionCookie is set automatically by apiclient interceptor via Set-Cookie header
  }));

  return { success: true };
};

/**
 * Register a new account.
 *
 * @param {{ firstname, lastname, email, telephone, password }} fields
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const register = async ({ firstname, lastname, email, telephone, password }) => {
  const { data, error } = await apiRequest({
    url: route('mobile/auth.register'),
    method: 'POST',
    data: { firstname, lastname, email, telephone, password },
  });

  if (error || !data?.success) {
    return { success: false, error: extractError(data, error, 'Registration failed. Please try again.') };
  }

  store.dispatch(setSession({
    user: {
      firstname: data.firstname,
      lastname:  data.lastname,
      email:     data.email,
      telephone: data.telephone,
    },
    customerId:    data.customer_id,
    customerToken: data.customer_token,
  }));

  return { success: true };
};

/**
 * Log out. Clears the server session then wipes Redux auth state.
 *
 * @returns {Promise<{success: boolean}>}
 */
export const logout = async () => {
  await apiRequest({ url: route('mobile/auth.logout'), method: 'POST' });
  store.dispatch(clearSession());
  return { success: true };
};

/**
 * Fetch the current customer's profile from the server.
 * Requires an active session (cookie or JWT).
 *
 * @returns {Promise<{success: boolean, customer?: object, error?: string}>}
 */
export const getProfile = async () => {
  const { data, error } = await apiRequest({ url: route('mobile/auth.info') });
  if (error || !data?.success) return { success: false, error };
  return { success: true, customer: data.customer };
};

// ── Profile ──────────────────────────────────────────────────────────────────

/**
 * Update profile fields on the server.
 * NOTE: requires account/* routes to be whitelisted in storefront_api.php
 * for JSON response (Phase 5 work).
 */
export const updateProfile = async (fields) => {
  const { data, error } = await apiRequest({
    url: route('account/edit.save'),
    method: 'POST',
    data: fields,
  });
  if (error || data?.error) return { success: false, error: data?.error || error };
  return { success: true };
};

// ── Addresses ────────────────────────────────────────────────────────────────

/**
 * Fetch the customer's saved addresses.
 * NOTE: requires 'account/address' in storefront_api.php PAGE_ROUTES (Phase 5).
 */
export const getAddresses = async () => {
  const { data, error } = await apiRequest({ url: route('account/address') });
  if (error || !data) return { success: false, error, addresses: [] };
  return { success: true, addresses: data.addresses || [] };
};

/**
 * Add a new address.
 */
export const addAddress = async (addressData) => {
  const { data, error } = await apiRequest({
    url: route('account/address.save'),
    method: 'POST',
    data: addressData,
  });
  if (error || data?.error) return { success: false, error: data?.error || error };
  return { success: true };
};

/**
 * Update an existing address.
 */
export const updateAddress = async (addressId, addressData) => {
  const { data, error } = await apiRequest({
    url: `${route('account/address.save')}&address_id=${addressId}`,
    method: 'POST',
    data: addressData,
  });
  if (error || data?.error) return { success: false, error: data?.error || error };
  return { success: true };
};

/**
 * Delete an address.
 */
export const deleteAddress = async (addressId) => {
  const { data, error } = await apiRequest({
    url: `${route('account/address.delete')}&address_id=${addressId}`,
    method: 'POST',
  });
  if (error || data?.error) return { success: false, error: data?.error || error };
  return { success: true };
};

// ── Orders ───────────────────────────────────────────────────────────────────

/**
 * Fetch the customer's order history.
 * NOTE: requires 'account/order' in storefront_api.php PAGE_ROUTES (Phase 5).
 */
export const getOrders = async (page = 1) => {
  const { data, error } = await apiRequest({
    url: `${route('account/order')}&page=${page}`,
  });
  if (error || !data) return { success: false, error, orders: [] };
  return { success: true, orders: data.orders || [] };
};

/**
 * Fetch a single order's detail.
 */
export const getOrderDetail = async (orderId) => {
  const { data, error } = await apiRequest({
    url: `${route('account/order.info')}&order_id=${orderId}`,
  });
  if (error || !data) return { success: false, error, order: null };
  return { success: true, order: data };
};

export default {
  login, register, logout, getProfile, updateProfile,
  getAddresses, addAddress, updateAddress, deleteAddress,
  getOrders, getOrderDetail,
};
