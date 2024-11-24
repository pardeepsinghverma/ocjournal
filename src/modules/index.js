    import { lazy } from 'react';
    import Category from './category';
    import MasterSlider from './MasterSlider';
import products from './Products';
import Products from './Products';
import Banner from './banner';

    // const Products = lazy(() => import('./Products'));
    const info_blocks = lazy(() => import('./InfoBlocks'));
    // const Banner = lazy(() => import('./banner'));

    const componentMap = {
        master_slider: MasterSlider,
        products: Products,
        // info_blocks: info_blocks,
        banners: Banner,
        categories: Category, // Reference to the Category component
    };

    export default componentMap;