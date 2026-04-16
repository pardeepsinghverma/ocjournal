// src/linking.js
const linking = {
    prefixes: ['ocjournal://', 'example://', 'https://example.com', 'http://example.com'],
    config: {
      screens: {
        main: {
          path: 'subdomain/:subdomain',
          parse: {
            subdomain: (subdomain) => `${subdomain}`,
          },
        },
        productView: 'product/:productId',
        catalog: 'catalog/:categoryId?',
        search: 'search',
        wishlist: 'wishlist',
        cart: 'cart',
        login: 'login',
      },
    },
  };
  
  export default linking;
  