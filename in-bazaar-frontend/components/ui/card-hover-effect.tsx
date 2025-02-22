"use client";

import React, { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

// We have two Product interfaces, so let's combine them into one
interface Product {
  id: number;
  title: string;
  quantity?: number;
  onQuantityChange?: (quantity: number) => void;
  onAddToCart?: (quantity: number) => void;
  image: string;
}

export const HoverEffect = ({
  items,
  className,
}: {
  items: Product[];
  className?: string;
}) => {
  // We'll keep the hover state for styling purposes, but without animation
  let [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 py-10",
        className
      )}
    >
      {items.map((item, idx) => (
        <Link
          href="#"
          // Using item.id for the key instead of index
          key={item.id}
          className="relative group block p-2 h-full w-full"
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          {/* Background image */}
          <div
            className="absolute inset-0 h-full w-full bg-cover bg-center rounded-3xl"
            style={{ backgroundImage: `url(${item.image})` }}
          />

          {/* Hover overlay - now without animation */}
          {hoveredIndex === idx && (
            <div className="absolute inset-0 h-full w-full block rounded-3xl transition-opacity duration-150" />
          )}

          <Card>
            <CardTitle>{item.title}</CardTitle>
            <ProductControls product={item} />
          </Card>
        </Link>
      ))}
    </div>
  );
};

const ProductControls = ({ product }: { product: Product }) => {
  const [quantity, setQuantity] = useState<number>(1);

  const handleIncrease = (e: React.MouseEvent) => {
    e.preventDefault();
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
    product.onQuantityChange?.(newQuantity);
  };

  const handleDecrease = (e: React.MouseEvent) => {
    e.preventDefault();
    if (quantity > 1) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      product.onQuantityChange?.(newQuantity);
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    product.onAddToCart?.(quantity);
    alert(`${product.title} (x${quantity}) added to cart!`);
  };

  return (
    <div className="mt-8 flex flex-col items-center gap-4">
      <div className="flex items-center gap-2">
        <button
          onClick={handleDecrease}
          className="px-2 py-1 bg-zinc-700 text-zinc-100 rounded hover:bg-zinc-600 transition-colors"
        >
          -
        </button>
        <span className="text-zinc-100">{quantity}</span>
        <button
          onClick={handleIncrease}
          className="px-2 py-1 bg-zinc-700 text-zinc-100 rounded hover:bg-zinc-600 transition-colors"
        >
          +
        </button>
      </div>
      <button
        onClick={handleAddToCart}
        className="w-full px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
      >
        Add to Cart
      </button>
    </div>
  );
};

export const Card = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "rounded-2xl h-full w-full p-4 overflow-hidden bg-black/10 border border-transparent dark:border-white/[0.2] relative z-20",
        className
      )}
    >
      <div className="relative z-50">
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};

export const CardTitle = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <h4 className={cn("text-zinc-100 font-bold tracking-wide mt-4", className)}>
      {children}
    </h4>
  );
};
