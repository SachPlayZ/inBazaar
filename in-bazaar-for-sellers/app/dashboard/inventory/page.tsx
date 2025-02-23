"use client";

import { useEffect, useState } from "react";
import { productService } from "@/services/product";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  url: string;
  measuringUnit: string;
  stoploss: number;
  Category: {
    type: string;
  } | null;
  createdAt: string;
}

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productService.getInventory();
        setProducts(data);
      } catch (err) {
        setError("Failed to load inventory");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Your Inventory</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <img
              src={product.url}
              alt={product.name}
              className="w-full h-48 object-cover rounded-md mb-4"
            />
            <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
            <p className="text-gray-600 mb-2 line-clamp-2">
              {product.description}
            </p>
            <div className="flex justify-between items-center">
              <span className="font-bold text-lg">₹{product.price}</span>
              <span className="text-sm text-gray-500">
                per {product.measuringUnit}
              </span>
            </div>
            <div className="mt-2 flex justify-between items-center">
              <span className="text-sm text-gray-500">
                Category: {product.Category?.type || "Uncategorized"}
              </span>
              <span className="text-sm text-red-500">
                Stop Loss: ₹{product.stoploss}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
