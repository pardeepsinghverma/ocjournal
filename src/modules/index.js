import { lazy } from 'react';
import Category from './category';

const Slider = lazy(() => import('./slider'));
const MasterSlider = lazy(() => import('./masterSlider'));
const Products = lazy(() => import('./Products'));
const info_blocks = lazy(() => import('./InfoBlocks'));
const Banner = lazy(() => import('./banner'));

const componentMap = {
    master_slider: MasterSlider,
    products: Products,
    info_blocks: info_blocks,
    banners: Banner,
    categories: Category,
};

export default componentMap;