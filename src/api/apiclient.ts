import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { API_DOMAIN, STOREFRONT_APP_KEY } from './const';

// Define the interface for API request parameters
interface ApiRequestParams {
  url: string; // API endpoint
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'; // HTTP methods (default is GET)
  data?: Record<string, any> | null; // Request body (optional)
  params?: Record<string, any> | null; // Query parameters (optional)
  headers?: Record<string, string>; // Custom headers (optional)
}

// Define the interface for the response or error structure
interface ApiResponse<T = any> {
  data?: T; // Response data
  error?: string; // Error message
  status?: number; // HTTP status code (optional)
}

/**
 * API Helper Function
 * Handles all API requests with Axios
 * 
 * @param {ApiRequestParams} options - The API request options
 * @returns {Promise<ApiResponse<T>>} - API response or error object
 */
const apiRequest = async <T>({
  url,
  method = 'GET',
  data = null,
  params = null,
  headers = {},
}: ApiRequestParams): Promise<ApiResponse<T>> => {
  try {
    // Create an axios instance with default settings
    const axiosInstance = axios.create({
      baseURL: API_DOMAIN, // storefront origin (see src/api/const.ts)
      timeout: 10000, // Set timeout for the request
    });

    // Axios request configuration
    const config: AxiosRequestConfig = {
      url,
      method,
      data,
      params,
      headers: {
        // Storefront content-negotiation header: makes the catalog URLs
        // return JSON instead of HTML. Gate 1 rejects requests without it.
        'X-OC-Storefront-App': STOREFRONT_APP_KEY,
        ...headers,
      },
    };

    // Make the request
    const response: AxiosResponse<T> = await axiosInstance(config);

    // Return the response data
    return { data: response.data };
  } catch (error: any) {
    // Handle errors
    if (axios.isCancel(error)) {
      return { error: 'Request canceled' };
    }
    if (error.response) {
      // Server responded with a status outside the range 2xx
      return { error: error.response.data || 'Server error', status: error.response.status };
    } else if (error.request) {
      // Request was made, but no response received
      return { error: 'No response from server' };
    } else {
      // Other errors (e.g., setup issues)
      return { error: error.message || 'Something went wrong' };
    }
  }
};

export default apiRequest;
