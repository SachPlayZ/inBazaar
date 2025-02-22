// // import { Injectable } from '@nestjs/common';
// // import { PrismaService } from '../../lib/database/prisma.service';
// // import { OrderDecisionDto } from './dto//Order.dto';

// // @Injectable()
// // export class OrderService {
// //   constructor(private readonly prisma: PrismaService) {}

// //   async acceptOrder(username: string, productId: string) {
// //     // Find the cart for the user by username.
// //     const cart = await this.prisma.cart.findFirst({
// //       where: { user: { username } },
// //       include: { cartItems: true },
// //     });
// //     if (!cart) {
// //       throw new Error('Cart not found for this user');
// //     }

// //     // Find the cart item corresponding to the productId.
// //     const cartItem = cart.cartItems.find(
// //       (item) => item.productId === productId,
// //     );
// //     if (!cartItem) {
// //       throw new Error('Product not found in cart');
// //     }

// //     // Retrieve product details (price) for updating totalPrice.
// //     const product = await this.prisma.product.findUnique({
// //       where: { id: productId },
// //       select: { price: true },
// //     });
// //     if (!product) {
// //       throw new Error('Product not found');
// //     }

// //     // Calculate the updated total price.
// //     const updatedTotalPrice = cart.totalPrice - product.price * cartItem.amount;

// //     // Remove the cart item completely.
// //     await this.prisma.cartItem.delete({
// //       where: { id: cartItem.id },
// //     });
// //     await this.prisma.cart.update({
// //       where: { id: cart.id },
// //       data: { totalPrice: updatedTotalPrice },
// //     });

// //     // Retrieve the current user (all fields, including orders).
// //     const user = await this.prisma.user.findUnique({
// //       where: { username },
// //     });
// //     // Default to an empty array if orders are not set.
// //     const currentOrders =
// //       (user?.orders as unknown as Array<{
// //         productId: string;
// //         amount: number;
// //       }>) || [];

// //     // Create a new order item.
// //     const newOrderItem = {
// //       productId: cartItem.productId,
// //       amount: cartItem.amount,
// //     };

// //     // Append the new order item.
// //     const updatedOrders = [...currentOrders, newOrderItem];

// //     // Update the user's orders field.
// //     await this.prisma.user.update({
// //       where: { username },
// //       data: { orders: updatedOrders },
// //     });

// //     return { message: 'Order accepted: cart item removed and order recorded.' };
// //   }

// //   async declineOrder(username: string, productId: string) {
// //     // Find the cart for the user by username.
// //     const cart = await this.prisma.cart.findFirst({
// //       where: { user: { username } },
// //       include: { cartItems: true },
// //     });
// //     if (!cart) {
// //       throw new Error('Cart not found for this user');
// //     }

// //     // Find the cart item corresponding to the productId.
// //     const cartItem = cart.cartItems.find(
// //       (item) => item.productId === productId,
// //     );
// //     if (!cartItem) {
// //       throw new Error('Product not found in cart');
// //     }

// //     // Retrieve product details (price).
// //     const product = await this.prisma.product.findUnique({
// //       where: { id: productId },
// //       select: { price: true },
// //     });
// //     if (!product) {
// //       throw new Error('Product not found');
// //     }

// //     // Calculate the updated total price.
// //     const updatedTotalPrice = cart.totalPrice - product.price * cartItem.amount;

// //     // Remove the cart item completely.
// //     await this.prisma.cartItem.delete({
// //       where: { id: cartItem.id },
// //     });
// //     await this.prisma.cart.update({
// //       where: { id: cart.id },
// //       data: { totalPrice: updatedTotalPrice },
// //     });

// //     return { message: 'Order declined: cart item removed.' };
// //   }
// // }

// import { Injectable } from '@nestjs/common';
// import { PrismaService } from '../../lib/database/prisma.service';
// import { OrderDecisionDto } from './dto/Order.dto';

// @Injectable()
// export class OrderService {
//   constructor(private readonly prisma: PrismaService) {}

//   async acceptOrder(username: string, productId: string) {
//     // Find the cart for the user by username.
//     const cart = await this.prisma.cart.findFirst({
//       where: { user: { username } },
//       include: { cartItems: true },
//     });
//     if (!cart) {
//       throw new Error('Cart not found for this user');
//     }

//     // Find the cart item corresponding to the productId.
//     const cartItem = cart.cartItems.find(
//       (item) => item.productId === productId,
//     );
//     if (!cartItem) {
//       throw new Error('Product not found in cart');
//     }

//     // Retrieve product details (price) for updating totalPrice.
//     const product = await this.prisma.product.findUnique({
//       where: { id: productId },
//       select: { price: true },
//     });
//     if (!product) {
//       throw new Error('Product not found');
//     }

//     // Calculate the updated total price using cartItem.amount.
//     const updatedTotalPrice = cart.totalPrice - product.price * cartItem.amount;

//     // Remove the cart item completely.
//     await this.prisma.cartItem.delete({
//       where: { id: cartItem.id },
//     });
//     await this.prisma.cart.update({
//       where: { id: cart.id },
//       data: { totalPrice: updatedTotalPrice },
//     });

//     // Retrieve the current user (all fields, including orders).
//     const user = await this.prisma.user.findUnique({
//       where: { username },
//     });
//     // Default to an empty array if orders are not set.
//     const currentOrders =
//       (user?.orders as Array<{ productId: string; quantity: number }>) || [];

//     // Create a new order item.
//     const newOrderItem = {
//       productId: cartItem.productId,
//       quantity: cartItem.amount, // Map "amount" to "quantity"
//     };

//     // Append the new order item.
//     const updatedOrders = [...currentOrders, newOrderItem];

//     // Update the user's orders field.
//     await this.prisma.user.update({
//       where: { username },
//       data: { orders: updatedOrders },
//     });

//     return { message: 'Order accepted: cart item removed and order recorded.' };
//   }

//   async declineOrder(username: string, productId: string) {
//     // Find the cart for the user by username.
//     const cart = await this.prisma.cart.findFirst({
//       where: { user: { username } },
//       include: { cartItems: true },
//     });
//     if (!cart) {
//       throw new Error('Cart not found for this user');
//     }

//     // Find the cart item corresponding to the productId.
//     const cartItem = cart.cartItems.find(
//       (item) => item.productId === productId,
//     );
//     if (!cartItem) {
//       throw new Error('Product not found in cart');
//     }

//     // Retrieve product details (price).
//     const product = await this.prisma.product.findUnique({
//       where: { id: productId },
//       select: { price: true },
//     });
//     if (!product) {
//       throw new Error('Product not found');
//     }

//     // Calculate the updated total price using cartItem.amount.
//     const updatedTotalPrice = cart.totalPrice - product.price * cartItem.amount;

//     // Remove the cart item completely.
//     await this.prisma.cartItem.delete({
//       where: { id: cartItem.id },
//     });
//     await this.prisma.cart.update({
//       where: { id: cart.id },
//       data: { totalPrice: updatedTotalPrice },
//     });

//     return { message: 'Order declined: cart item removed.' };
//   }
// }

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../lib/database/prisma.service';
import { OrderDecisionDto } from './dto/Order.dto';

@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService) {}

  async acceptOrder(username: string, productId: string) {
    // Find the cart for the user by username.
    const cart = await this.prisma.cart.findFirst({
      where: { user: { username } },
      include: { cartItems: true },
    });
    if (!cart) {
      throw new Error('Cart not found for this user');
    }

    // Find the cart item corresponding to the productId.
    const cartItem = cart.cartItems.find(
      (item) => item.productId === productId,
    );
    if (!cartItem) {
      throw new Error('Product not found in cart');
    }

    // Retrieve product details (price) for updating totalPrice.
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      select: { price: true },
    });
    if (!product) {
      throw new Error('Product not found');
    }

    // Calculate the updated total price using cartItem.quantity.
    const updatedTotalPrice =
      cart.totalPrice - product.price * cartItem.quantity;

    // Remove the cart item completely.
    await this.prisma.cartItem.delete({
      where: { id: cartItem.id },
    });
    await this.prisma.cart.update({
      where: { id: cart.id },
      data: { totalPrice: updatedTotalPrice },
    });

    // Retrieve the current user (all fields, including orders).
    const user = await this.prisma.user.findUnique({
      where: { username },
    });
    // Default to an empty array if orders are not set.
    const currentOrders =
      (user?.orders as Array<{ productId: string; quantity: number }>) || [];

    // Create a new order item using the cart item’s quantity.
    const newOrderItem = {
      productId: cartItem.productId,
      quantity: cartItem.quantity,
    };

    // Append the new order item.
    const updatedOrders = [...currentOrders, newOrderItem];

    // Update the user's orders field.
    await this.prisma.user.update({
      where: { username },
      data: { orders: updatedOrders },
    });

    return { message: 'Order accepted: cart item removed and order recorded.' };
  }

  async declineOrder(username: string, productId: string) {
    // Find the cart for the user by username.
    const cart = await this.prisma.cart.findFirst({
      where: { user: { username } },
      include: { cartItems: true },
    });
    if (!cart) {
      throw new Error('Cart not found for this user');
    }

    // Find the cart item corresponding to the productId.
    const cartItem = cart.cartItems.find(
      (item) => item.productId === productId,
    );
    if (!cartItem) {
      throw new Error('Product not found in cart');
    }

    // Retrieve product details (price).
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      select: { price: true },
    });
    if (!product) {
      throw new Error('Product not found');
    }

    // Calculate the updated total price using cartItem.quantity.
    const updatedTotalPrice =
      cart.totalPrice - product.price * cartItem.quantity;

    // Remove the cart item completely.
    await this.prisma.cartItem.delete({
      where: { id: cartItem.id },
    });
    await this.prisma.cart.update({
      where: { id: cart.id },
      data: { totalPrice: updatedTotalPrice },
    });

    return { message: 'Order declined: cart item removed.' };
  }
}
