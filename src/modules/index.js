    import { lazy } from 'react';
    import Category from './category';
    import MasterSlider from './MasterSlider';
import products from './Products';
import Products from './Products';
import Banner from './banner';

    // const Products = lazy(() => import('./Products'));
import Title from './Title';
import InfoBlocks from './InfoBlocks';

    const componentMap = {
        master_slider: MasterSlider,
        slider: MasterSlider,
        products: Products,
        info_blocks: InfoBlocks,
        banners: Banner,
        categories: Category, 
        title: Title,
    };

    export default componentMap;