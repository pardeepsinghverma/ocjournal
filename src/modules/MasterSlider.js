import React, { Children } from 'react'
import { getPlaceholderImage } from '../utils/getImage';
import { Text } from 'tamagui'
import Slider from '../components/Slider/Slider';
// import Slider from './slider';

const MasterSlider = ({data, options}) => {
    const mapSlides = (sliderData) => {
        if (!sliderData || typeof sliderData !== 'object') {
          return [];
        }
      
        // Transform the input data
        return Object.values(sliderData).map((slide) => {
            // In new home.json structure, the image is often a sub-item of type 'image'
            let slideImage = slide.image;
            if (!slideImage && slide.items) {
                const imageLayer = Object.values(slide.items).find(item => item.type === 'image');
                if (imageLayer) {
                    slideImage = imageLayer.image;
                }
            }

            return {
                id: slide.id || Math.random().toString(), 
                image: getPlaceholderImage(slideImage, 800, 400, 'Slider'),
                children: slide.items ? Object.values(slide.items).map((child) => ({
                        type: child.type,
                        text: child.text,
                        data: child.data,
                    })) : []
            };
        });
    };
    // console.log(mapSlides(data))

    return (
        // <Slider
        //     slides={mapSlides(data)}
        //     autoSlide={true}
        //     slideInterval={5000}
        //     showArrows={true}
        //     slideStyle={0}
        //     showBullets={false}
        //     bulletWithImage={true}
        // />
        <Slider
            slideData={mapSlides(data)}
            options={options.options}
        />
    )
}

export default MasterSlider
