import { lazy } from 'react';

const Slider = lazy(() => import('./slider'));
const ProductGrid = lazy(() => import('./productGrid'));
const Banner = lazy(() => import('./banner'));

const componentMap = {
    slider: Slider,
    productGrid: ProductGrid,
    banner: Banner,
};

export default componentMap;