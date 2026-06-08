    import { lazy } from 'react';
    import Category from './category';
    import MasterSlider from './MasterSlider';
import products from './Products';
import Products from './Products';
import Banner from './banner';

    // const Products = lazy(() => import('./Products'));
import Title from './Title';
import InfoBlocks from './InfoBlocks';
import Marquee from './Marquee';
import Manufacturers from './Manufacturers';
import Testimonials from './Testimonials';
import BlogPosts from './BlogPosts';
import Gallery from './Gallery';
import Grid from './Grid';

    const componentMap = {
        master_slider: MasterSlider,
        slider: MasterSlider,
        products: Products,
        info_blocks: InfoBlocks,
        banners: Banner,
        categories: Category,
        title: Title,
        marquee: Marquee,
        manufacturers: Manufacturers,
        testimonials: Testimonials,
        blog_posts: BlogPosts,
        gallery: Gallery,
        grid: Grid,
    };

    export default componentMap;