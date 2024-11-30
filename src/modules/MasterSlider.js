import React, { Children } from 'react'
import { Text } from 'tamagui'
import Slider from './slider';

const MasterSlider = ({data}) => {
    // console.log(data)
    const mapSlides = (sliderData) => {
        if (!sliderData || typeof sliderData !== 'object') {
          throw new Error('Invalid slider data');
        }
      
        // Transform the input data
        return Object.values(sliderData).map((slide) => ({
            id: parseInt(slide.category_id, 10), // Convert category_id to integer
            image: slide.image, // Map the thumbnail as the image
            children: Object.values(slide.items).map((child) => ({
                    type: child.type,
                    text: child.text,
                    data: child.data,
                }))
        }));
    };

    return (
        <Slider
            slides={mapSlides(data)}
            autoSlide={true}
            slideInterval={5000}
            showArrows={true}
            slideStyle={0}
            showBullets={false}
            bulletWithImage={true}
        />
    )
}

export default MasterSlider
