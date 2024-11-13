// src/linking.js
const linking = {
    prefixes: ['example://', 'https://example.com', 'http://example.com'],
    config: {
      screens: {
        main: {
          path: 'subdomain/:subdomain',
          parse: {
            subdomain: (subdomain) => `${subdomain}`,
          },
        },
        child: 'child',
        category: 'category',
      },
    },
  };
  
  export default linking;
  