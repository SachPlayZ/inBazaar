"use client";
import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
const initialCartItems = [
  {
    id: 1,
    name: "Premium Headphones",
    price: 199.99,
    quantity: 2,
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: 2,
    name: "Wireless Mouse",
    price: 49.99,
    quantity: 1,
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: 3,
    name: "Mechanical Keyboard",
    price: 129.99,
    quantity: 1,
    image: "/placeholder.svg?height=200&width=200",
  },
];

export default function CartPage() {
  const [cartItems, setCartItems] = useState(initialCartItems);

  const handleDelete = (id: number) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

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
                src={item.image || "/placeholder.svg"}
                alt={item.name}
                width={200}
                height={200}
                className="rounded-md object-cover w-48 h-48 flex-shrink-0"
              />
              <div className="flex-grow flex flex-col space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-semibold">{item.name}</h2>
                    <p className="text-muted-foreground">
                      Price: ${item.price.toFixed(2)}
                    </p>
                  </div>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDelete(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex justify-between items-end">
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="icon">
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="text-lg font-medium">{item.quantity}</span>
                    <Button variant="outline" size="icon">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-lg font-bold">
                    ${(item.price * item.quantity).toFixed(2)}
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
            <span>
              $
              {cartItems
                .reduce((total, item) => total + item.price * item.quantity, 0)
                .toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between mb-4">
            <span>Shipping:</span>
            <span>$10.00</span>
          </div>
          <div className="flex justify-between text-lg font-bold">
            <span>Total:</span>
            <span>
              $
              {(
                cartItems.reduce(
                  (total, item) => total + item.price * item.quantity,
                  0
                ) + 10
              ).toFixed(2)}
            </span>
          </div>
          <Button className="w-full mt-4">Proceed to Checkout</Button>
        </div>
      </div>
    </div>
  );
}
