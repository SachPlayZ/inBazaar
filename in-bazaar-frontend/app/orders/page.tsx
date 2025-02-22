"use client";
import { useState } from "react";
import { Order } from "./types/orders";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Sample data - in a real app, this would come from an API
const sampleOrders: Order[] = [
  {
    id: "1",
    orderNumber: "ORD-2025-001",
    date: "2025-02-20",
    status: "delivered",
    items: [
      { id: "1", name: "Wireless Headphones", quantity: 1, price: 199.99 },
      { id: "2", name: "Phone Case", quantity: 2, price: 29.99 },
    ],
    total: 259.97,
  },
  {
    id: "2",
    orderNumber: "ORD-2025-002",
    date: "2025-02-21",
    status: "pending",
    items: [{ id: "3", name: "Smart Watch", quantity: 1, price: 299.99 }],
    total: 299.99,
  },
];

// Utility function to get status color
const getStatusColor = (status: Order["status"]): string => {
  const colors = {
    pending: "bg-yellow-500",
    shipped: "bg-blue-500",
    delivered: "bg-green-500",
    cancelled: "bg-red-500",
  };
  return colors[status];
};

export default function MyOrders() {
  const [orders] = useState<Order[]>(sampleOrders);

  return (
    // Adding a gradient background to make the glassmorphic effect more visible
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-gray-800">My Orders</h1>

        {/* Main container with subtle glass effect */}
        <div className="backdrop-blur-md bg-white/20 rounded-2xl p-6 shadow-xl border border-white/40">
          {orders.map((order) => (
            <Card
              key={order.id}
              // Adding transition and hover effects for the main card
              className="mb-6 last:mb-0 backdrop-blur-sm bg-white/30 border-white/40 
                       transition-all duration-300 hover:bg-white hover:shadow-lg"
            >
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl font-semibold text-gray-800">
                  Order #{order.orderNumber}
                </CardTitle>
                <Badge
                  className={`${getStatusColor(
                    order.status
                  )} text-white px-3 py-1 rounded-full`}
                >
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </Badge>
              </CardHeader>

              <CardContent>
                <div className="space-y-4">
                  <p className="text-gray-600">
                    Ordered on: {new Date(order.date).toLocaleDateString()}
                  </p>

                  {/* Items container with enhanced glass effect */}
                  <div className="backdrop-blur-sm bg-white/20 rounded-lg p-4 transition-all duration-300">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        // Adding hover effect for individual items
                        className="flex justify-between items-center py-2 border-b border-white/40 
                                 last:border-0 rounded-lg transition-all duration-300 
                                 hover:bg-white hover:shadow-md px-3 -mx-3"
                      >
                        <div>
                          <p className="font-medium text-gray-800">
                            {item.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            Quantity: {item.quantity}
                          </p>
                        </div>
                        <p className="font-medium text-gray-800">
                          ${item.price.toFixed(2)}
                        </p>
                      </div>
                    ))}

                    {/* Total section with consistent styling */}
                    <div className="flex justify-between items-center mt-4 pt-4 border-t border-white/40 px-3 -mx-3">
                      <p className="font-semibold text-gray-800">Total</p>
                      <p className="font-semibold text-gray-800">
                        ${order.total.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
