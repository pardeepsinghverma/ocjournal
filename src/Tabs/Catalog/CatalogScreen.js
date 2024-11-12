// src/screens/HomeScreen.js
import React from 'react';
import { View, Text } from 'tamagui';
import ProductGrid from '../../modules/productGrid';

export default function CatalogScreen() {
  const products = [
    {
      id: 1,
      name: "Classic T-Shirt",
      oldPrice: "₹20.00",
      specialPrice: "₹15.00",
      description: "A classic t-shirt made from 100% organic cotton.",
      wishlistStatus: true, // true if added to wishlist, false otherwise
      productLabel: "Buy 2 For ₹999",
      image: "https://example.com/classic-tshirt.jpg"
    },
    {
      id: 2,
      name: "Leather Jacket",
      oldPrice: "₹120.00",
      specialPrice: "₹99.00",
      description: "Genuine leather jacket with a modern fit.",
      wishlistStatus: false,
      productLabel: "Limited Stock",
      image: "https://example.com/leather-jacket.jpg"
    },
    {
      id: 3,
      name: "Running Shoes",
      oldPrice: "₹75.00",
      specialPrice: "₹60.00",
      description: "Lightweight and comfortable running shoes for daily wear.",
      wishlistStatus: true,
      productLabel: "Buy 2 For ₹999",
      image: "https://example.com/running-shoes.jpg"
    },
    {
      id: 4,
      name: "Summer Shorts",
      oldPrice: "₹25.00",
      specialPrice: "₹20.00",
      description: "Comfortable and breathable shorts for summer.",
      wishlistStatus: false,
      productLabel: "New Arrival",
      image: "https://example.com/summer-shorts.jpg"
    },
    {
      id: 5,
      name: "Denim Jeans",
      oldPrice: "₹50.00",
      specialPrice: "₹40.00",
      description: "Stylish denim jeans with a classic straight fit.",
      wishlistStatus: true,
      productLabel: "Discount Offer",
      image: "https://example.com/denim-jeans.jpg"
    }
  ];
  return (
    <ProductGrid products={products} scroll={false} />
  );
}
