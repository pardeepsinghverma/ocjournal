/**
 * componentMap — registry that maps Journal3 module type strings to React
 * Native components.
 *
 * HomeScreen reads `item.item.type` at the leaf of the layout tree and looks
 * up the corresponding component here.  Only the 12 types listed below are
 * currently handled; any other type string returns `undefined` (rendered as
 * null by HomeScreen).
 */
import Category from './category';
import MasterSlider from './MasterSlider';
import Products from './Products';
import Banner from './banner';
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