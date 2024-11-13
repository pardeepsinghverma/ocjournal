import axios from 'axios';
import { API_DOMAIN, HELPING_DOMAIN, API_ENDPOINTS } from './const';

    // Create an Axios instance with the base URL
    const apiClient = axios.create({
    baseURL: `${API_DOMAIN}${HELPING_DOMAIN}`, // Combine the domain and route
    });

    // Example: Fetching products
    apiClient.get(API_ENDPOINTS.PRODUCTS)
    .then(response => {
        console.log('Products:', response.data);
    })
    .catch(error => {
        console.error('Error fetching products:', error);
    });

    // Example: User login
    apiClient.post(API_ENDPOINTS.USERS, { username: 'test', password: 'password' })
    .then(response => {
        console.log('User Login:', response.data);
    })
    .catch(error => {
        console.error('Error logging in:', error);
    });
