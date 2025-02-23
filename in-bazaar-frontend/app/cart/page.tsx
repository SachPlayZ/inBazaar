"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "@/contexts/UserContext";
import { toast } from "sonner";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

interface CartItem {
  id: string;
  quantity: number;
  product: {
    id: string;
    title: string;
    price: number;
    image: string;
  };
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  useEffect(() => {
    if (!user) return;
    fetchCartItems();
  }, [user]);

  const fetchCartItems = async () => {
    try {
      const response = await fetch(
        `${BACKEND_URL}/cart/items/${user?.username}`
      );
      if (!response.ok) throw new Error("Failed to fetch cart");
      const data = await response.json();
      setCartItems(data);
    } catch (error) {
      console.error("Error fetching cart:", error);
      toast.error("Failed to load cart items");
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = async (
    productId: string,
    action: "add" | "remove"
  ) => {
    try {
      if (action === "remove") {
        const response = await fetch(
          `${BACKEND_URL}/cart/items/${user?.username}/${productId}`,
          { method: "DELETE" }
        );
        if (!response.ok) throw new Error("Failed to update cart");
      } else {
        const response = await fetch(
          `${BACKEND_URL}/cart/items/${user?.username}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ productId, quantity: 1 }),
          }
        );
        if (!response.ok) throw new Error("Failed to update cart");
      }

      await fetchCartItems(); // Refresh cart items
      toast.success("Cart updated successfully");
    } catch (error) {
      console.error("Error updating cart:", error);
      toast.error("Failed to update cart");
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        Please sign in to view your cart
      </div>
    );
  }

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  const subtotal = cartItems.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );
  const shipping = 10;
  const total = subtotal + shipping;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
      <div className="space-y-6">
        <AnimatePresence>
          {cartItems.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="flex items-center bg-card/50 backdrop-blur-md shadow-lg rounded-lg p-6 space-x-6 border border-white/10"
            >
              <Image
                src={item.product.image}
                alt={item.product.title}
                width={200}
                height={200}
                className="rounded-md object-cover w-48 h-48 flex-shrink-0"
              />
              <div className="flex-grow flex flex-col space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-semibold">
                      {item.product.title}
                    </h2>
                    <p className="text-muted-foreground">
                      Price: ${item.product.price.toFixed(2)}
                    </p>
                  </div>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() =>
                      handleQuantityChange(item.product.id, "remove")
                    }
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex justify-between items-end">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() =>
                        handleQuantityChange(item.product.id, "remove")
                      }
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="text-lg font-medium">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() =>
                        handleQuantityChange(item.product.id, "add")
                      }
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-lg font-bold">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <div className="mt-8 flex justify-end">
        <div className="bg-card/50 backdrop-blur-md shadow-lg rounded-lg p-6 w-full md:w-1/3 border border-white/10">
          <h2 className="text-2xl font-semibold mb-4">Cart Summary</h2>
          <div className="flex justify-between mb-2">
            <span>Subtotal:</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-4">
            <span>Shipping:</span>
            <span>${shipping.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-lg font-bold">
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <Button className="w-full mt-4">Proceed to Checkout</Button>
        </div>
      </div>
    </div>
  );
}
