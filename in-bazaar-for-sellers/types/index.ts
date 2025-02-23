export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  totalPurchases: number;
  lastPurchase: Date;
}

export interface Sale {
  id: string;
  customer: Customer;
  products: Product[];
  total: number;
  date: Date;
}
