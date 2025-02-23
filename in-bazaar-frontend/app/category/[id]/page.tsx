"use client";
import { useEffect, useState } from "react";
import { HoverEffect } from "@/components/ui/card-hover-effect";
import { useUser } from "@/contexts/UserContext";
import { toast } from "sonner";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

interface Product {
  id: string;
  name: string;
  description: string;
  url: string;
  price: number;
  measuringUnit: string;
  seller: {
    username: string;
  };
}

interface CategoryData {
  id: string;
  type: string;
  slug: string;
  products: Product[];
}

export default function CategoryPage({ params }: { params: { id: string } }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [loading, setLoading] = useState(true);
  const { user } = useUser();
  const categoryName = params.id.charAt(0).toUpperCase() + params.id.slice(1);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `${BACKEND_URL}/category/slug/${params.id}`
        );
        if (!response.ok) throw new Error("Failed to fetch products");
        const categoryData: CategoryData = await response.json();
        if (!categoryData) {
          toast.error("Category not found");
          setProducts([]);
          return;
        }
        setProducts(categoryData.products);
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("Failed to load products");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [params.id]);

  const updateQuantity = (productId: string, delta: number) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: Math.max(1, (prev[productId] || 1) + delta),
    }));
  };

  const handleAddToCart = async (productId: string) => {
    if (!user) {
      toast.error("Please sign in to add items to cart");
      return;
    }

    try {
      const quantity = quantities[productId] || 1;
      const response = await fetch(
        `${BACKEND_URL}/cart/items/${user.username}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            productId,
            quantity,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to add to cart");
      toast.success("Added to cart successfully");
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add to cart");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        No products found in this category
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl p-6">
      <h1 className="text-2xl font-bold mb-6 capitalize">
        {categoryName} Collection
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-card rounded-lg overflow-hidden shadow-lg"
          >
            <img
              src={product.url}
              alt={product.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
              <p className="text-sm text-gray-600 mb-2">
                {product.description}
              </p>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm">{product.measuringUnit}</span>
                <span className="font-bold">${product.price}</span>
              </div>
              <p className="text-sm text-gray-500 mb-4">
                Seller: {product.seller.username}
              </p>
              <div className="flex items-center gap-2 mb-4">
                <button
                  onClick={() => updateQuantity(product.id, -1)}
                  className="px-2 py-1 bg-gray-200 rounded"
                >
                  -
                </button>
                <span className="px-4">{quantities[product.id] || 1}</span>
                <button
                  onClick={() => updateQuantity(product.id, 1)}
                  className="px-2 py-1 bg-gray-200 rounded"
                >
                  +
                </button>
              </div>
              <button
                onClick={() => handleAddToCart(product.id)}
                className="w-full bg-primary text-white py-2 rounded-md hover:bg-primary/90 transition-colors"
                disabled={!user}
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
