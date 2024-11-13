const BASE_URL = 'https://your-api-base-url.com'; // Set your base URL here

export default class Api {
  static async request(endpoint, method = 'GET', params = null, body = null, headers = {}) {
    const url = new URL(`${BASE_URL}${endpoint}`);

    // Append query parameters if present
    if (params) {
      Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
    }

    const config = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    };

    // Add body for POST, PUT, PATCH
    if (body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      config.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(url.toString(), config);
      const jsonResponse = await response.json();

      if (!response.ok) {
        throw new Error(jsonResponse.message || 'An error occurred');
      }

      return jsonResponse;
    } catch (error) {
      console.error(`Error in ${method} request to ${endpoint}:`, error);
      throw error;
    }
  }

  static get(endpoint, params = {}, headers = {}) {
    return this.request(endpoint, 'GET', params, null, headers);
  }

  static post(endpoint, body = {}, headers = {}) {
    return this.request(endpoint, 'POST', null, body, headers);
  }

  static put(endpoint, body = {}, headers = {}) {
    return this.request(endpoint, 'PUT', null, body, headers);
  }

  static delete(endpoint, headers = {}) {
    return this.request(endpoint, 'DELETE', null, null, headers);
  }
}
