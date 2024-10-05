import { TamaguiProvider, createTamagui } from '@tamagui/core';
import { config } from '@tamagui/config/v3';
import { ProductCard } from './src/components/products/card';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_DOMAIN, API_ENDPOINTS, HELPING_DOMAIN } from './src/api/const';

// you usually export this from a tamagui.config.ts file
const tamaguiConfig = createTamagui(config);

// TypeScript types across all Tamagui APIs
type Conf = typeof tamaguiConfig;
declare module '@tamagui/core' {
  interface TamaguiCustomConfig extends Conf {}
}

export default () => {
  const [products, setProducts] = useState([]);
  const [userSession, setUserSession] = useState(null);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_DOMAIN}${HELPING_DOMAIN}${API_ENDPOINTS.PRODUCTS}`, {
        headers: {
          'Authorization': `Bearer ${userSession}`, // No "Token:" text, just "Bearer <token>"
          'Cookie': 'OCSESSID=c4dcf9b2980e15461752745846; currency=USD; language=en-gb'
        }
      });
  
      if (response.data) {
        console.log('Products:', response.data);
        setProducts(response.data);  // Store the fetched products in state
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  console.log('products', userSession);
  const fetchLogin = async () => {
    if (userSession) { 
      return;
    }
    try {
      const response = await axios.post(`${API_DOMAIN}${HELPING_DOMAIN}${API_ENDPOINTS.USERS}`, {
        key: 'vbPYXv8ae6JnoZE2SFe7epx2RMUeGzyBycqS1AaaKKlN8Cmmja0nvsPKkTAQZIAYZgdPYF7RM5Srcd4J2gZflxnDm7NBpL1pTjsIU6nskKL7IFwGAWdfp7iUhabYXf5fnLjTx1BWBqjmevg2IBY7j6mDFBwspw6e6eititzhtQKnamWVbVP3LQkBd2EjIBouWEq5l5ejLKpv45pJsUOVgvySbItVrFBkBLm3pMpKwyfJuapwa72WQ8fgRl4whiml'
      });
  
      if (response.data) {
        setUserSession(response.data.api_token);  // Store the user session in state
      }
    } catch (error) {
      console.error('Error logging in:', error);
    }
  }

  useEffect(() => {
    fetchLogin();
    // fetchProducts();
  }, []);

  return (
    <TamaguiProvider config={tamaguiConfig}>
      {/* <ProductCard products={products} /> */}
    </TamaguiProvider>
  );
};
