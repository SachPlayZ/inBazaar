// // // import { Injectable, Logger } from '@nestjs/common';
// // // import { PrismaService } from '../../lib/database/prisma.service';
// // // import { OrderDecisionDto } from './dto/Order.dto';

// // // @Injectable()
// // // export class OrderService {
// // //   private readonly logger = new Logger(OrderService.name);

// // //   constructor(private readonly prisma: PrismaService) {}

// // //   // Helper: Retrieve cart with fallback logic for null measuringUnit issues.
// // //   async getCartWithFallback(username: string) {
// // //     let cart;
// // //     try {
// // //       cart = await this.prisma.cart.findFirst({
// // //         where: { user: { username } },
// // //         include: {
// // //           cartItems: {
// // //             include: {
// // //               product: {
// // //                 include: {
// // //                   Category: true,
// // //                   seller: true,
// // //                 },
// // //               },
// // //             },
// // //           },
// // //         },
// // //       });
// // //     } catch (error) {
// // //       if (
// // //         error.message &&
// // //         error.message.includes('measuringUnit') &&
// // //         error.message.includes('null')
// // //       ) {
// // //         // Find products with a null measuringUnit.
// // //         const productsToFix = await this.prisma.product.findMany({
// // //           where: { measuringUnit: null },
// // //         });
// // //         // Update each product individually.
// // //         for (const prod of productsToFix) {
// // //           await this.prisma.product.update({
// // //             where: { id: prod.id },
// // //             data: { measuringUnit: 'default unit' },
// // //           });
// // //         }
// // //         // Retry fetching the cart.
// // //         cart = await this.prisma.cart.findFirst({
// // //           where: { user: { username } },
// // //           include: {
// // //             cartItems: {
// // //               include: {
// // //                 product: {
// // //                   include: {
// // //                     Category: true,
// // //                     seller: true,
// // //                   },
// // //                 },
// // //               },
// // //             },
// // //           },
// // //         });
// // //       } else {
// // //         this.logger.error('Error fetching cart:', error);
// // //         throw error;
// // //       }
// // //     }
// // //     return cart;
// // //   }

// // //   async acceptOrder(username: string, productId: string) {
// // //     // Retrieve the cart using our fallback logic.
// // //     const cart = await this.getCartWithFallback(username);
// // //     if (!cart) {
// // //       throw new Error('Cart not found for this user');
// // //     }

// // //     // Add logging to debug cart items
// // //     this.logger.debug(`Cart items: ${JSON.stringify(cart.cartItems)}`);
// // //     this.logger.debug(`Looking for product ID: ${productId}`);

// // //     // Find the matching cart item with more robust comparison
// // //     const cartItem = cart.cartItems.find((item) => {
// // //       this.logger.debug(`Comparing ${item.productId} with ${productId}`);
// // //       return item.productId === productId;
// // //     });

// // //     if (!cartItem) {
// // //       // Log all product IDs in cart for debugging
// // //       const cartProductIds = cart.cartItems.map((item) => item.productId);
// // //       this.logger.error(
// // //         `Product ${productId} not found in cart. Available products: ${cartProductIds.join(', ')}`,
// // //       );
// // //       throw new Error('Product not found in cart');
// // //     }

// // //     // Retrieve product details for price.
// // //     const product = await this.prisma.product.findUnique({
// // //       where: { id: productId },
// // //       select: { price: true },
// // //     });
// // //     if (!product) {
// // //       throw new Error('Product not found');
// // //     }

// // //     // Update total price.
// // //     const updatedTotalPrice =
// // //       cart.totalPrice - product.price * cartItem.quantity;

// // //     // Remove the cart item.
// // //     await this.prisma.cartItem.delete({
// // //       where: { id: cartItem.id },
// // //     });
// // //     await this.prisma.cart.update({
// // //       where: { id: cart.id },
// // //       data: { totalPrice: updatedTotalPrice },
// // //     });

// // //     // Retrieve the current user.
// // //     const user = await this.prisma.user.findUnique({
// // //       where: { username },
// // //     });
// // //     const currentOrders =
// // //       (user?.orders as Array<{ productId: string; quantity: number }>) || [];

// // //     // Create a new order item using the cart item's quantity.
// // //     const newOrderItem = {
// // //       productId: cartItem.productId,
// // //       quantity: cartItem.quantity,
// // //     };

// // //     // Append and update the orders field.
// // //     const updatedOrders = [...currentOrders, newOrderItem];
// // //     await this.prisma.user.update({
// // //       where: { username },
// // //       data: { orders: updatedOrders },
// // //     });

// // //     return { message: 'Order accepted: cart item removed and order recorded.' };
// // //   }

// // //   async declineOrder(username: string, productId: string) {
// // //     // Retrieve the cart using our fallback logic.
// // //     const cart = await this.getCartWithFallback(username);
// // //     if (!cart) {
// // //       throw new Error('Cart not found for this user');
// // //     }

// // //     // Add logging to debug cart items
// // //     this.logger.debug(`Cart items: ${JSON.stringify(cart.cartItems)}`);
// // //     this.logger.debug(`Looking for product ID: ${productId}`);

// // //     // Find the matching cart item with more robust comparison
// // //     const cartItem = cart.cartItems.find((item) => {
// // //       this.logger.debug(`Comparing ${item.productId} with ${productId}`);
// // //       return item.productId === productId;
// // //     });

// // //     if (!cartItem) {
// // //       // Log all product IDs in cart for debugging
// // //       const cartProductIds = cart.cartItems.map((item) => item.productId);
// // //       this.logger.error(
// // //         `Product ${productId} not found in cart. Available products: ${cartProductIds.join(', ')}`,
// // //       );
// // //       throw new Error('Product not found in cart');
// // //     }

// // //     // Retrieve product details.
// // //     const product = await this.prisma.product.findUnique({
// // //       where: { id: productId },
// // //       select: { price: true },
// // //     });
// // //     if (!product) {
// // //       throw new Error('Product not found');
// // //     }

// // //     // Update the cart's total price.
// // //     const updatedTotalPrice =
// // //       cart.totalPrice - product.price * cartItem.quantity;

// // //     // Remove the cart item.
// // //     await this.prisma.cartItem.delete({
// // //       where: { id: cartItem.id },
// // //     });
// // //     await this.prisma.cart.update({
// // //       where: { id: cart.id },
// // //       data: { totalPrice: updatedTotalPrice },
// // //     });

// // //     return { message: 'Order declined: cart item removed.' };
// // //   }
// // // }
// // import { Injectable, Logger } from '@nestjs/common';
// // import { PrismaService } from '../../lib/database/prisma.service';
// // import { OrderDecisionDto } from './dto/Order.dto';

// // @Injectable()
// // export class OrderService {
// //   private readonly logger = new Logger(OrderService.name);

// //   constructor(private readonly prisma: PrismaService) {}

// //   // Helper: Retrieve cart with fallback logic for null measuringUnit issues.
// //   async getCartWithFallback(username: string) {
// //     let cart;
// //     try {
// //       cart = await this.prisma.cart.findFirst({
// //         where: { user: { username } },
// //         include: {
// //           cartItems: {
// //             include: {
// //               product: {
// //                 include: {
// //                   Category: true,
// //                   seller: true,
// //                 },
// //               },
// //             },
// //           },
// //         },
// //       });
// //     } catch (error) {
// //       if (
// //         error.message &&
// //         error.message.includes('measuringUnit') &&
// //         error.message.includes('null')
// //       ) {
// //         // Find products with a null measuringUnit.
// //         const productsToFix = await this.prisma.product.findMany({
// //           where: { measuringUnit: null },
// //         });
// //         // Update each product individually.
// //         for (const prod of productsToFix) {
// //           await this.prisma.product.update({
// //             where: { id: prod.id },
// //             data: { measuringUnit: 'default unit' },
// //           });
// //         }
// //         // Retry fetching the cart.
// //         cart = await this.prisma.cart.findFirst({
// //           where: { user: { username } },
// //           include: {
// //             cartItems: {
// //               include: {
// //                 product: {
// //                   include: {
// //                     Category: true,
// //                     seller: true,
// //                   },
// //                 },
// //               },
// //             },
// //           },
// //         });
// //       } else {
// //         this.logger.error('Error fetching cart:', error);
// //         throw error;
// //       }
// //     }
// //     return cart;
// //   }

// //   async acceptOrder(username: string, productId: string) {
// //     // Retrieve the cart using our fallback logic.
// //     const cart = await this.getCartWithFallback(username);
// //     if (!cart) {
// //       throw new Error('Cart not found for this user');
// //     }

// //     // Add logging to debug cart items
// //     this.logger.debug(`Cart items: ${JSON.stringify(cart.cartItems)}`);
// //     this.logger.debug(`Looking for product ID: ${productId}`);

// //     // Find the matching cart item with more robust comparison
// //     const cartItem = cart.cartItems.find((item) => {
// //       this.logger.debug(`Comparing ${item.productId} with ${productId}`);
// //       return item.productId === productId;
// //     });

// //     if (!cartItem) {
// //       // Log all product IDs in cart for debugging
// //       const cartProductIds = cart.cartItems.map((item) => item.productId);
// //       this.logger.error(
// //         `Product ${productId} not found in cart. Available products: ${cartProductIds.join(', ')}`,
// //       );
// //       throw new Error('Product not found in cart');
// //     }

// //     // Retrieve product details for price.
// //     const product = await this.prisma.product.findUnique({
// //       where: { id: productId },
// //       select: { price: true },
// //     });
// //     if (!product) {
// //       throw new Error('Product not found');
// //     }

// //     // Update total price.
// //     const updatedTotalPrice =
// //       cart.totalPrice - product.price * cartItem.quantity;

// //     // Remove the cart item.
// //     await this.prisma.cartItem.delete({
// //       where: { id: cartItem.id },
// //     });
// //     await this.prisma.cart.update({
// //       where: { id: cart.id },
// //       data: { totalPrice: updatedTotalPrice },
// //     });

// //     // Retrieve the current user.
// //     const user = await this.prisma.user.findUnique({
// //       where: { username },
// //     });
// //     const currentOrders =
// //       (user?.orders as Array<{ productId: string; quantity: number }>) || [];

// //     // Create a new order item using the cart item's quantity.
// //     const newOrderItem = {
// //       productId: cartItem.productId,
// //       quantity: cartItem.quantity,
// //     };

// //     // Append and update the orders field.
// //     const updatedOrders = [...currentOrders, newOrderItem];
// //     await this.prisma.user.update({
// //       where: { username },
// //       data: { orders: updatedOrders },
// //     });

// //     console.log(currentOrders);

// //     return { message: 'Order accepted: cart item removed and order recorded.' };
// //   }

// //   async declineOrder(username: string, productId: string) {
// //     // Retrieve the cart using our fallback logic.
// //     const cart = await this.getCartWithFallback(username);
// //     if (!cart) {
// //       throw new Error('Cart not found for this user');
// //     }

// //     // Add logging to debug cart items
// //     this.logger.debug(`Cart items: ${JSON.stringify(cart.cartItems)}`);
// //     this.logger.debug(`Looking for product ID: ${productId}`);

// //     // Find the matching cart item with more robust comparison
// //     const cartItem = cart.cartItems.find((item) => {
// //       this.logger.debug(`Comparing ${item.productId} with ${productId}`);
// //       return item.productId === productId;
// //     });

// //     if (!cartItem) {
// //       // Log all product IDs in cart for debugging
// //       const cartProductIds = cart.cartItems.map((item) => item.productId);
// //       this.logger.error(
// //         `Product ${productId} not found in cart. Available products: ${cartProductIds.join(', ')}`,
// //       );
// //       throw new Error('Product not found in cart');
// //     }

// //     // Retrieve product details.
// //     const product = await this.prisma.product.findUnique({
// //       where: { id: productId },
// //       select: { price: true },
// //     });
// //     if (!product) {
// //       throw new Error('Product not found');
// //     }

// //     // Update the cart's total price.
// //     const updatedTotalPrice =
// //       cart.totalPrice - product.price * cartItem.quantity;

// //     // Remove the cart item.
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

// import { Injectable, Logger } from '@nestjs/common';
// import { PrismaService } from '../../lib/database/prisma.service';
// import { OrderDecisionDto } from './dto/Order.dto';

// @Injectable()
// export class OrderService {
//   private readonly logger = new Logger(OrderService.name);

//   constructor(private readonly prisma: PrismaService) {}

//   // Helper: Retrieve cart with fallback logic for null measuringUnit issues.
//   async getCartWithFallback(username: string) {
//     let cart;
//     try {
//       cart = await this.prisma.cart.findFirst({
//         where: { user: { username } },
//         include: {
//           cartItems: {
//             include: {
//               product: {
//                 include: {
//                   Category: true,
//                   seller: true,
//                 },
//               },
//             },
//           },
//         },
//       });
//     } catch (error) {
//       if (
//         error.message &&
//         error.message.includes('measuringUnit') &&
//         error.message.includes('null')
//       ) {
//         // Find products with a null measuringUnit.
//         const productsToFix = await this.prisma.product.findMany({
//           where: { measuringUnit: null },
//         });
//         // Update each product individually.
//         for (const prod of productsToFix) {
//           await this.prisma.product.update({
//             where: { id: prod.id },
//             data: { measuringUnit: 'default unit' },
//           });
//         }
//         // Retry fetching the cart.
//         cart = await this.prisma.cart.findFirst({
//           where: { user: { username } },
//           include: {
//             cartItems: {
//               include: {
//                 product: {
//                   include: {
//                     Category: true,
//                     seller: true,
//                   },
//                 },
//               },
//             },
//           },
//         });
//       } else {
//         this.logger.error('Error fetching cart:', error);
//         throw error;
//       }
//     }
//     return cart;
//   }

//   async acceptOrder(username: string, productId: string) {
//     // Retrieve the cart using our fallback logic.
//     const cart = await this.getCartWithFallback(username);
//     if (!cart) {
//       throw new Error('Cart not found for this user');
//     }

//     // Debug log cart items.
//     this.logger.debug(`Cart items: ${JSON.stringify(cart.cartItems)}`);
//     this.logger.debug(`Looking for product ID: ${productId}`);

//     // Find the matching cart item with robust comparison.
//     const cartItem = cart.cartItems.find((item) => {
//       this.logger.debug(`Comparing ${item.productId} with ${productId}`);
//       return item.productId === productId;
//     });

//     if (!cartItem) {
//       const cartProductIds = cart.cartItems.map((item) => item.productId);
//       this.logger.error(
//         `Product ${productId} not found in cart. Available products: ${cartProductIds.join(', ')}`,
//       );
//       throw new Error('Product not found in cart');
//     }

//     // Retrieve product details for price.
//     const product = await this.prisma.product.findUnique({
//       where: { id: productId },
//       select: { price: true },
//     });
//     if (!product) {
//       throw new Error('Product not found');
//     }

//     // Update total price.
//     const updatedTotalPrice =
//       cart.totalPrice - product.price * cartItem.quantity;

//     // Remove the cart item.
//     await this.prisma.cartItem.delete({
//       where: { id: cartItem.id },
//     });
//     await this.prisma.cart.update({
//       where: { id: cart.id },
//       data: { totalPrice: updatedTotalPrice },
//     });

//     // Create a new Order record mapping this cart item.
//     const orderRecord = await this.prisma.order.create({
//       data: {
//         cartItemId: cartItem.id,
//       },
//     });

//     return {
//       message: 'Order accepted: cart item removed and order recorded.',
//       order: orderRecord,
//     };
//   }

//   async declineOrder(username: string, productId: string) {
//     // Retrieve the cart using our fallback logic.
//     const cart = await this.getCartWithFallback(username);
//     if (!cart) {
//       throw new Error('Cart not found for this user');
//     }

//     // Debug log cart items.
//     this.logger.debug(`Cart items: ${JSON.stringify(cart.cartItems)}`);
//     this.logger.debug(`Looking for product ID: ${productId}`);

//     // Find the matching cart item.
//     const cartItem = cart.cartItems.find((item) => {
//       this.logger.debug(`Comparing ${item.productId} with ${productId}`);
//       return item.productId === productId;
//     });

//     if (!cartItem) {
//       const cartProductIds = cart.cartItems.map((item) => item.productId);
//       this.logger.error(
//         `Product ${productId} not found in cart. Available products: ${cartProductIds.join(', ')}`,
//       );
//       throw new Error('Product not found in cart');
//     }

//     // Retrieve product details.
//     const product = await this.prisma.product.findUnique({
//       where: { id: productId },
//       select: { price: true },
//     });
//     if (!product) {
//       throw new Error('Product not found');
//     }

//     // Update the cart's total price.
//     const updatedTotalPrice =
//       cart.totalPrice - product.price * cartItem.quantity;

//     // Remove the cart item.
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

import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../lib/database/prisma.service';
import { OrderDecisionDto } from './dto/Order.dto';

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);

  constructor(private readonly prisma: PrismaService) {}

  // Helper: Retrieve cart with fallback logic for null measuringUnit issues.
  async getCartWithFallback(username: string) {
    let cart;
    try {
      cart = await this.prisma.cart.findFirst({
        where: { user: { username } },
        include: {
          cartItems: {
            include: {
              product: {
                include: {
                  Category: true,
                  seller: true,
                },
              },
            },
          },
        },
      });
    } catch (error) {
      if (
        error.message &&
        error.message.includes('measuringUnit') &&
        error.message.includes('null')
      ) {
        // Find products with a null measuringUnit.
        const productsToFix = await this.prisma.product.findMany({
          where: { measuringUnit: null },
        });
        // Update each product individually.
        for (const prod of productsToFix) {
          await this.prisma.product.update({
            where: { id: prod.id },
            data: { measuringUnit: 'default unit' },
          });
        }
        // Retry fetching the cart.
        cart = await this.prisma.cart.findFirst({
          where: { user: { username } },
          include: {
            cartItems: {
              include: {
                product: {
                  include: {
                    Category: true,
                    seller: true,
                  },
                },
              },
            },
          },
        });
      } else {
        this.logger.error('Error fetching cart:', error);
        throw error;
      }
    }
    return cart;
  }

  async acceptOrder(username: string, productId: string) {
    // Retrieve the cart using our fallback logic.
    const cart = await this.getCartWithFallback(username);
    if (!cart) {
      throw new Error('Cart not found for this user');
    }

    this.logger.debug(`Cart items: ${JSON.stringify(cart.cartItems)}`);
    this.logger.debug(`Looking for product ID: ${productId}`);

    // Find the matching cart item.
    const cartItem = cart.cartItems.find((item) => {
      this.logger.debug(`Comparing ${item.productId} with ${productId}`);
      return item.productId === productId;
    });

    if (!cartItem) {
      const cartProductIds = cart.cartItems.map((item) => item.productId);
      this.logger.error(
        `Product ${productId} not found in cart. Available products: ${cartProductIds.join(', ')}`,
      );
      throw new Error('Product not found in cart');
    }

    // Retrieve product details for price.
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      select: { price: true },
    });
    if (!product) {
      throw new Error('Product not found');
    }

    // Calculate the updated total price.
    const updatedTotalPrice =
      cart.totalPrice - product.price * cartItem.quantity;

    // Remove the cart item.
    await this.prisma.cartItem.delete({
      where: { id: cartItem.id },
    });
    await this.prisma.cart.update({
      where: { id: cart.id },
      data: { totalPrice: updatedTotalPrice },
    });

    // Create a new Order record that stores the cartItemId and the quantity.
    const orderRecord = await this.prisma.order.create({
      data: {
        cartItemId: cartItem.id,
        quantity: cartItem.quantity,
      },
    });

    return {
      message: 'Order accepted: cart item removed and order recorded.',
      order: orderRecord,
    };
  }

  async declineOrder(username: string, productId: string) {
    // Retrieve the cart using our fallback logic.
    const cart = await this.getCartWithFallback(username);
    if (!cart) {
      throw new Error('Cart not found for this user');
    }

    this.logger.debug(`Cart items: ${JSON.stringify(cart.cartItems)}`);
    this.logger.debug(`Looking for product ID: ${productId}`);

    // Find the matching cart item.
    const cartItem = cart.cartItems.find((item) => {
      this.logger.debug(`Comparing ${item.productId} with ${productId}`);
      return item.productId === productId;
    });

    if (!cartItem) {
      const cartProductIds = cart.cartItems.map((item) => item.productId);
      this.logger.error(
        `Product ${productId} not found in cart. Available products: ${cartProductIds.join(', ')}`,
      );
      throw new Error('Product not found in cart');
    }

    // Retrieve product details.
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      select: { price: true },
    });
    if (!product) {
      throw new Error('Product not found');
    }

    // Calculate the updated total price.
    const updatedTotalPrice =
      cart.totalPrice - product.price * cartItem.quantity;

    // Remove the cart item.
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
