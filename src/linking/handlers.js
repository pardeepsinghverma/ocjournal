// src/handler.js
import { Linking } from 'react-native';
import { setData } from '../store/dataSlice';

const handleDeepLinkSetup = (dispatch) => {
  const handleDeepLink = (event) => {
    const url = event.url;
    const { subdomain } = parseUrl(url);
    if (subdomain) {
      dispatch(setData({ name: "currentSubDomain", data: subdomain }));
    }
  };

  const parseUrl = (url) => {
    // Extract the subdomain from the URL, assuming the structure is example.com/subdomain/:subdomain
    const match = url.match(/example\.com\/subdomain\/([^\/?]+)/);
    if (match) {
      return { subdomain: match[1] };
    }
    return {};
  };

  // Add listener for incoming links
  const linkingListener = Linking.addListener('url', handleDeepLink);

  // Check for the initial URL if the app was opened via a link
  Linking.getInitialURL().then((url) => {
    if (url) {
      handleDeepLink({ url });
    }
  });

  // Return cleanup function to remove the listener
  return () => {
    linkingListener.remove();
  };
};

export default handleDeepLinkSetup;
