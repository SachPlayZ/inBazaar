"use client";

import React, { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { Input } from "./input";
import { Plus, Minus } from "lucide-react";

// We have two Product interfaces, so let's combine them into one
interface Product {
  id: string;
  title: string;
  description: string;
  image: string;
  price: number;
  seller: string;
  stock: number;
  onAddToCart: (quantity: number) => void;
}

export function HoverEffect({
  items,
  className,
}: {
  items: Product[];
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4",
        className
      )}
    >
      {items.map((item) => (
        <ProductCard key={item.id} item={item} />
      ))}
    </div>
  );
}

function ProductCard({ item }: { item: Product }) {
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white">
      <div className="aspect-h-4 aspect-w-3 bg-gray-200 sm:aspect-none group-hover:opacity-75 sm:h-96">
        <img
          src={item.image}
          alt={item.title}
          className="h-full w-full object-cover object-center sm:h-full sm:w-full"
        />
      </div>
      <div className="flex flex-1 flex-col space-y-2 p-4">
        <h3 className="text-sm font-medium text-gray-900">{item.title}</h3>
        <p className="text-sm text-gray-500">{item.description}</p>
        <div className="flex flex-1 flex-col justify-end">
          <p className="text-base font-medium text-gray-900">${item.price}</p>
          <p className="text-sm text-gray-500">Seller: {item.seller}</p>
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <Input
                type="number"
                min="1"
                max={item.stock}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-16 text-center"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(Math.min(item.stock, quantity + 1))}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <Button
              onClick={() => item.onAddToCart(quantity)}
              disabled={!item.stock}
            >
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

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
