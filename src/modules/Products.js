import React from 'react'
import { Text, View } from 'tamagui'
import ProductGrid from './productGrid';
import MSection from '../components/MSection';

const Products = ({ data }) => {
    return (
        Object.keys(data).map((itemKey) => {
            const item = data[itemKey];
            return <ProductGrid key={itemKey} products={item.products} title={data[itemKey].title} />
        })
    )
}

export default Products
