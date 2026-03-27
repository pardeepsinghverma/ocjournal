// src/components/HeaderLogo.js
import React from 'react';
import { Image } from 'tamagui';
import { useSelector } from 'react-redux';

const HeaderLogo = () => {
  const store = useSelector((state) => state.data.currentSubDomain);
  
  return (
    <Image
      source={{
        uri:
          store === 'stylesphere'
            ? 'https://cdn.fathersolution.com/m/1/1476/0476/image/catalog/undefined/icons/LOGO.png'
            : 'https://cdn.fathersolution.com/m/12/11178/0085/image/catalog/fathershops/fashion/fashion.png',
      }}
      style={{ width: 150, height: 25 }}
    />
  );
};

export default HeaderLogo;