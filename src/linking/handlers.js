// src/handler.js
import { Linking } from 'react-native';
import { setData } from '../store/dataSlice';
// import { loadStoreData } from '../store/storeActions'; // optional (if you have API call)

const handleDeepLinkSetup = (dispatch) => {
  
  const parseUrl = (url) => {
    try {
      console.log('Parsing URL:', url);

      // Remove scheme (ocjournal:// or https://)
      const cleanUrl = url.replace(/.*?:\/\//, '');

      // Example:
      // ocjournal://subdomain/store1
      // → subdomain/store1

      const parts = cleanUrl.split('/');

      if (parts[0] === 'subdomain' && parts[1]) {
        return { subdomain: parts[1] };
      }

    } catch (e) {
      console.log('Parse error:', e);
    }

    return {};
  };

  // 🔥 Handle incoming deep link
  const handleDeepLink = (event) => {
    const url = event?.url;

    if (!url) return;

    console.log('Deep link received:', url);

    const { subdomain } = parseUrl(url);

    if (subdomain) {
      console.log('Extracted subdomain:', subdomain);

      // ✅ Update Redux
      dispatch(setData({ name: 'currentSubDomain', data: subdomain }));

      // 🔥 OPTIONAL: trigger store load (recommended)
      // dispatch(loadStoreData(subdomain));

      // 🔥 OPTIONAL: persist last store
      // AsyncStorage.setItem('lastStore', subdomain);
    } else {
      console.log('No subdomain found in URL');
    }
  };

  // ✅ Listen for deep links when app is running
  const linkingListener = Linking.addEventListener('url', handleDeepLink);

  // ✅ Handle app open via deep link (cold start)
  const init = async () => {
    const url = await Linking.getInitialURL();

    if (url) {
      handleDeepLink({ url });
    }
  };

  init();

  // ✅ Cleanup listener
  return () => {
    linkingListener.remove();
  };
};

export default handleDeepLinkSetup;