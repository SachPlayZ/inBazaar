export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: "pending" | "shipped" | "delivered" | "cancelled";
  items: OrderItem[];
  total: number;
}
