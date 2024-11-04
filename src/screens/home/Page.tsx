import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import Layout from '../layout'
import { ProductCard } from '../../components/products/card'
import { useDispatch } from 'react-redux'
import axios from 'axios'
import { API_DOMAIN, API_ENDPOINTS, HELPING_DOMAIN } from '../../api/const'
import { setItem } from '../../redux/itemsSlice'
import { useSelector } from 'react-redux';
import { setData } from '../../redux/dataSlice'

const Home = () => {
    const dispatch = useDispatch();
    const userSession = useSelector((state: any) => state?.data?.sessionID);
    const products = useSelector((state: any) => state?.items?.products);
    
    const fetchProducts = async () => {
        try {
          const response = await axios.get(`${API_DOMAIN}${HELPING_DOMAIN}${API_ENDPOINTS.PRODUCTS}`, {
            headers: {
              'Authorization': `Bearer ${userSession}`,
            },
          });
          
          if (response.status === 200) {
              const data = response.data; // Axios automatically parses JSON responses
                dispatch(setItem({ key: 'products', value: data?.products }));
          }
        } catch (error) {
          console.error('Error fetching products:', error);
        }
      };
  
    const fetchLogin = async () => {
        if (userSession) {
            console.log('User already logged in');
          return;
        }
        try {
          const response = await axios.post(`${API_DOMAIN}${HELPING_DOMAIN}${API_ENDPOINTS.USERS}`, {
            key: 'your-api-key-here', // Replace with actual key
          });
      
          if (response.status === 200) {
            // Extract the OCSESSID from the response headers
            const setCookieHeader = response.headers['set-cookie'];
            if (setCookieHeader) {
              // The OCSESSID is in the 'set-cookie' header
              const sessionCookie = setCookieHeader.find((cookie) => cookie.startsWith('OCSESSID='));
              if (sessionCookie) {
                const ocSessionId = sessionCookie.split(';')[0].split('=')[1]; // Extract OCSESSID value
                dispatch(setData({ key: 'sessionID', value: ocSessionId }));
              }
            }
            // Store the user token if necessary
            // if (response.data && response.data.api_token) {
            //   dispatch(setItem({ key: 'userToken', value: response.data.api_token }));
            // }
          }
        } catch (error) {
          console.error('Error logging in:', error);
        }
    };
      
  
    useEffect(() => {
        fetchLogin();
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [userSession]);
  
    return (
        <ProductCard products={products} />
    )
}

export default Home

const styles = StyleSheet.create({})