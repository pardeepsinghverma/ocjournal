// API connection constants for the brandwik OpenCart backend.
// See docs/Backend-API-Integration-Guide.md for the full picture.

// Base origin of the storefront.
//  - Android emulator -> the host machine is 10.0.2.2 (NOT localhost).
//  - Physical device  -> use your PC's LAN IP, e.g. 'http://192.168.1.20:8080'.
//  - iOS simulator    -> 'http://localhost:8080' works.
export const API_DOMAIN = 'http://10.0.2.2:8080';

// Storefront JSON API key (sent as the X-OC-Storefront-App header).
// Dev gate is OPEN: any non-empty value works. In prod it must match
// the backend's config_storefront_api_key exactly.
export const STOREFRONT_APP_KEY = 'testkey';

// Storefront routing prefix. Routes are passed WITHOUT a 'journal3/' prefix
// (the backend strips/re-adds it itself).
export const STOREFRONT_ROUTE = '/index.php?route=';

// Whitelisted storefront (browsing) routes.
export const API_ENDPOINTS = {
  COMMON_HOME: 'common/home',
  PRODUCT: 'product/product',
  PRODUCT_CATEGORY: 'product/category',
  PRODUCT_SEARCH: 'product/search',
  PRODUCT_SPECIAL: 'product/special',
  INFORMATION: 'information/information',
};
