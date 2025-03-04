"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "@/contexts/UserContext";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { BargainModal } from "@/components/BargainModal";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

interface CartItem {
  id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    url: string;
    description: string;
    measuringUnit: string;
  };
  cartId: string;
  suggestedPrice?: number;
  discountedPrice?: number;
  isSuggestedPriceLoading?: boolean;
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();
  const router = useRouter();
  const [isBargainModalOpen, setIsBargainModalOpen] = useState(false);
  const [selectedCartItem, setSelectedCartItem] = useState<string | null>(null);
  const [selectedItemInitialPrice, setSelectedItemInitialPrice] =
    useState<number>(0);

  useEffect(() => {
    if (!user) return;
    fetchCartItems();
  }, [user]);

  const fetchSuggestedPrice = async (cartItemId: string) => {
    try {
      const response = await fetch(
        `${BACKEND_URL}/bargain/scraped-price?cartItemId=${cartItemId}`,
        {
          credentials: "include",
        }
      );
      if (!response.ok) {
        console.error(
          "Failed to fetch suggested price:",
          await response.text()
        );
        return null;
      }
      const data = await response.json();
      return data.suggestedPrice;
    } catch (error) {
      console.error("Error fetching suggested price:", error);
      return null;
    }
  };

  const fetchCartItems = async () => {
    try {
      const response = await fetch(
        `${BACKEND_URL}/cart/items/${user?.username}`
      );
      if (!response.ok) throw new Error("Failed to fetch cart");
      const data = await response.json();

      const itemsWithLoadingState = data.map((item: CartItem) => ({
        ...item,
        isSuggestedPriceLoading: true,
      }));
      setCartItems(itemsWithLoadingState);
      setLoading(false);

      for (const item of itemsWithLoadingState) {
        const suggestedPrice = await fetchSuggestedPrice(item.id);
        setCartItems((prevItems) =>
          prevItems.map((prevItem) =>
            prevItem.id === item.id
              ? {
                  ...prevItem,
                  suggestedPrice,
                  isSuggestedPriceLoading: false,
                }
              : prevItem
          )
        );
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
      toast.error("Failed to load cart items");
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

  const handleBargain = async (cartItemId: string, initialPrice: number) => {
    setSelectedCartItem(cartItemId);
    setSelectedItemInitialPrice(initialPrice);
    setIsBargainModalOpen(true);
  };

  const handleBargainAccepted = async (newPrice: number) => {
    await fetchCartItems(); // Refresh cart items after accepting offer
  };

  const handleCheckout = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/orders/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          items: cartItems.map((item) => ({
            cartItemId: item.id,
            quantity: item.quantity,
            price: item.discountedPrice || item.product.price,
          })),
        }),
      });

      if (!response.ok) throw new Error("Checkout failed");

      toast.success("Order placed successfully!");
      router.push("/orders");
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Failed to place order");
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

  const total = cartItems.reduce(
    (total, item) =>
      total + (item.discountedPrice || item.product.price) * item.quantity,
    0
  );

  return (
    <>
      <div className="container mx-auto px-4 py-8 min-h-screen">
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
                  src={item.product.url}
                  alt={item.product.name}
                  width={200}
                  height={200}
                  className="rounded-md object-cover w-48 h-48 flex-shrink-0"
                />
                <div className="flex-grow flex flex-col space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-semibold">
                        {item.product.name}
                      </h2>
                      <div className="flex items-center gap-2">
                        <p className="text-muted-foreground">
                          Price: ₹{item.product.price.toFixed(2)} per{" "}
                          {item.product.measuringUnit}
                        </p>
                        {item.isSuggestedPriceLoading ? (
                          <span className="px-2 py-1 bg-green-50 text-green-800 rounded-md text-sm animate-pulse">
                            Loading suggestion...
                          </span>
                        ) : (
                          item.suggestedPrice &&
                          item.suggestedPrice < item.product.price && (
                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-md text-sm flex items-center gap-1">
                              <span>
                                Suggested: ₹{item.suggestedPrice.toFixed(2)}
                              </span>
                              <span className="text-xs">
                                (Save ₹
                                {(
                                  item.product.price - item.suggestedPrice
                                ).toFixed(2)}
                                )
                              </span>
                            </span>
                          )
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {item.product.description}
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
                      <span className="text-lg font-medium">
                        {item.quantity}
                      </span>
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
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        onClick={() =>
                          handleBargain(item.id, item.product.price)
                        }
                        className="text-sm"
                      >
                        Bargain
                      </Button>
                      <p className="text-lg font-bold">
                        ₹
                        {(
                          (item.discountedPrice || item.product.price) *
                          item.quantity
                        ).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        <div className="mt-8 flex justify-end">
          <div className="bg-card/50 backdrop-blur-md shadow-lg rounded-lg p-6 w-full md:w-1/3 border border-white/10">
            <h2 className="text-2xl font-semibold mb-4">Cart Summary</h2>
            <div className="flex justify-between text-lg font-bold">
              <span>Total:</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
            <Button className="w-full mt-4" onClick={handleCheckout}>
              Proceed to Checkout
            </Button>
          </div>
        </div>
      </div>
      {selectedCartItem && (
        <BargainModal
          isOpen={isBargainModalOpen}
          onClose={() => {
            setIsBargainModalOpen(false);
            setSelectedCartItem(null);
          }}
          cartItemId={selectedCartItem}
          onAccept={handleBargainAccepted}
          initialPrice={selectedItemInitialPrice}
        />
      )}
    </>
  );
}
