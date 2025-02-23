interface Product {
  id: string;
  price: number;
}

interface User {
  firstname: string | null;
  lastname: string | null;
  email: string;
}

interface Cart {
  user: User;
}

interface CartItem {
  quantity: number;
  product: Product;
  cart: Cart;
}

interface Order {
  id: string;
  cartItem: CartItem;
  orderTime: Date;
}

export type { Order, CartItem, Cart, User, Product };
