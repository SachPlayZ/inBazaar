"use client";

import React from "react";
import { HoverEffect } from "@/components/ui/card-hover-effect";

// First, let's define our interfaces to ensure type safety throughout the component
interface Product {
  id: number;
  title: string;
  image: string;
  category: string;
}

// Our mock database of products - in a real application, this would likely come from an API or database
const productsDatabase: Product[] = [
  {
    id: 1,
    title: "Sleek Jacket",
    image:
      "https://plus.unsplash.com/premium_photo-1707928727452-9791050b13fd?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    category: "outerwear",
  },
  {
    id: 2,
    title: "Casual T-Shirt",
    image:
      "https://images.unsplash.com/photo-1571455786673-9d9d6c194f90?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    category: "tops",
  },
  {
    id: 3,
    title: "Stylish Jeans",
    image:
      "https://i.pinimg.com/736x/da/e5/e5/dae5e5886544c43e558a00dcbf219a28.jpg",
    category: "bottoms",
  },
  {
    id: 4,
    title: "Vintage Hat",
    image:
      "https://i.pinimg.com/736x/a0/d3/9e/a0d39e673d60ab37cc420944693d177e.jpg",
    category: "accessories",
  },
];

// The main category page component
export default function CategoryPage({ params }: { params: { id: string } }) {
  // Format the category name for display - convert from URL format to display format
  const categoryName = params.id.charAt(0).toUpperCase() + params.id.slice(1);

  // Transform our products into the format expected by HoverEffect
  const formattedProducts = productsDatabase.map((product) => ({
    id: product.id,
    title: product.title,
    image: product.image,
    // Adding callbacks for the product controls
    onQuantityChange: (quantity: number) => {
      console.log(`Quantity changed for ${product.title}: ${quantity}`);
    },
    onAddToCart: (quantity: number) => {
      alert(`Added ${quantity}x ${product.title} to cart`);
    },
  }));

  return (
    <div className="mx-auto max-w-6xl p-6">
      <h1 className="text-2xl font-bold mb-6 capitalize">
        {categoryName === "All" ? "All Products" : `${categoryName} Collection`}
      </h1>

      {/* Using our enhanced HoverEffect component directly */}
      <HoverEffect
        items={formattedProducts}
        className="grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
      />
    </div>
  );
}
