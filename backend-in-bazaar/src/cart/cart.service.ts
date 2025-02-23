// // import { Injectable, Logger } from '@nestjs/common';
// // import { PrismaService } from 'lib/database/prisma.service';

// // @Injectable()
// // export class CartService {
// //   private readonly logger = new Logger(CartService.name);

// //   constructor(private prisma: PrismaService) {}

// //   // Retrieves the cart for a given user (by username)
// //   async getCart(username: string) {
// //     try {
// //       // Find the cart by linking through the User record (using the username)
// //       const cart = await this.prisma.cart.findFirst({
// //         where: { user: { username } },
// //         include: {
// //           cartItems: {
// //             include: {
// //               product: {
// //                 include: {
// //                   Category: true, // Include category details for each product
// //                   seller: true, // Optionally include seller details if needed
// //                 },
// //               },
// //             },
// //           },
// //         },
// //       });

// //       if (!cart) {
// //         return [];
// //       }

// //       return cart.cartItems;
// //     } catch (error) {
// //       this.logger.error('Error fetching cart:', error);
// //       throw error;
// //     }
// //   }

// //   // Adds a product to the cart for a given user (by username)
// //   async addProductToCart(
// //     username: string,
// //     productId: string,
// //     quantity: number,
// //   ) {
// //     try {
// //       // Find the cart for the user by username
// //       let cart = await this.prisma.cart.findFirst({
// //         where: { user: { username } },
// //         include: { cartItems: true },
// //       });

// //       // If the cart doesn't exist, create one
// //       if (!cart) {
// //         const user = await this.prisma.user.findUnique({
// //           where: { username },
// //         });
// //         if (!user) {
// //           throw new Error('User not found');
// //         }
// //         cart = await this.prisma.cart.create({
// //           data: {
// //             user: { connect: { id: user.id } },
// //             totalPrice: 0,
// //             totalDiscountedPrice: 0,
// //           },
// //           include: { cartItems: true },
// //         });
// //       }

// //       // Get product details (price)
// //       const product = await this.prisma.product.findUnique({
// //         where: { id: productId },
// //         select: { price: true },
// //       });
// //       if (!product) {
// //         throw new Error('Product not found');
// //       }
// //       const additionalCost = product.price * quantity;

// //       // Check if the product already exists in the cart
// //       const existingCartItem = cart.cartItems.find(
// //         (item) => item.productId === productId,
// //       );

// //       if (existingCartItem) {
// //         // Update the quantity of the existing cart item
// //         const updatedCartItem = await this.prisma.cartItem.update({
// //           where: { id: existingCartItem.id },
// //           data: { quantity: existingCartItem.quantity + quantity },
// //         });
// //         // Update the cart's totalPrice
// //         await this.prisma.cart.update({
// //           where: { id: cart.id },
// //           data: { totalPrice: cart.totalPrice + additionalCost },
// //         });
// //         return updatedCartItem;
// //       } else {
// //         // Create a new cart item
// //         const newCartItem = await this.prisma.cartItem.create({
// //           data: {
// //             product: { connect: { id: productId } },
// //             quantity,
// //             cart: { connect: { id: cart.id } },
// //           },
// //         });
// //         // Update the cart's totalPrice
// //         await this.prisma.cart.update({
// //           where: { id: cart.id },
// //           data: { totalPrice: cart.totalPrice + additionalCost },
// //         });
// //         return newCartItem;
// //       }
// //     } catch (error) {
// //       this.logger.error('Error adding product to cart:', error);
// //       throw error;
// //     }
// //   }

// //   async removeProductFromCart(username: string, productId: string) {
// //     try {
// //       // Find the cart for the user by username.
// //       const cart = await this.prisma.cart.findFirst({
// //         where: { user: { username } },
// //         include: { cartItems: true },
// //       });

// //       if (!cart) {
// //         throw new Error('Cart not found for this user');
// //       }

// //       // Find the cart item corresponding to the productId.
// //       const cartItem = cart.cartItems.find(
// //         (item) => item.productId === productId,
// //       );
// //       if (!cartItem) {
// //         throw new Error('Product not found in cart');
// //       }

// //       // Fetch product details (price).
// //       const product = await this.prisma.product.findUnique({
// //         where: { id: productId },
// //         select: { price: true },
// //       });
// //       if (!product) {
// //         throw new Error('Product not found');
// //       }

// //       // Calculate new totalPrice: subtract product price once.
// //       const updatedTotalPrice = cart.totalPrice - product.price;

// //       if (cartItem.quantity > 1) {
// //         // Decrement quantity by 1.
// //         await this.prisma.cartItem.update({
// //           where: { id: cartItem.id },
// //           data: { quantity: cartItem.quantity - 1 },
// //         });
// //       } else {
// //         // quantity is 1, so delete the cart item.
// //         await this.prisma.cartItem.delete({
// //           where: { id: cartItem.id },
// //         });
// //       }

// //       // Update the cart's totalPrice.
// //       await this.prisma.cart.update({
// //         where: { id: cart.id },
// //         data: { totalPrice: updatedTotalPrice },
// //       });

// //       return { message: 'Product quantity decreased successfully' };
// //     } catch (error) {
// //       console.error('Error in removeProductFromCart:', error);
// //       throw error;
// //     }
// //   }
// // }

// // import { Injectable } from '@nestjs/common';
// // import { PrismaService } from 'lib/database/prisma.service';

// // @Injectable()
// // export class CartService {
// //   constructor(private prisma: PrismaService) {}

// //   async getCart(username: string) {
// //     try {
// //       // Find the user's cart by their username via the related User model
// //       const cart = await this.prisma.cart.findFirst({
// //         where: { user: { username } },
// //         include: {
// //           cartItems: {
// //             include: { product: true },
// //           },
// //         },
// //       });

// //       if (!cart) {
// //         return [];
// //       }

// //       return cart.cartItems;
// //     } catch (error) {
// //       console.error('Error fetching cart:', error);
// //       throw error;
// //     }
// //   }

// //   async addProductToCart(
// //     username: string,
// //     productId: string,
// //     quantity: number,
// //   ) {
// //     // Fetch the product details (e.g., price)
// //     const product = await this.prisma.product.findUnique({
// //       where: { id: productId },
// //       select: { price: true },
// //     });

// //     if (!product) {
// //       throw new Error('Product not found');
// //     }

// //     // Calculate the additional cost (assuming price is in the same unit as totalPrice)
// //     const additionalCost = product.price * quantity;

// //     // Find the user's cart using the unique username field
// //     let cart = await this.prisma.cart.findFirst({
// //       where: { user: { username } },
// //       include: { cartItems: true },
// //     });

// //     // If the cart doesn't exist, create a new one and initialize the total price
// //     if (!cart) {
// //       cart = await this.prisma.cart.create({
// //         data: {
// //           user: { connect: { username } },
// //           totalPrice: additionalCost,
// //           totalDiscountedPrice: additionalCost, // Adjust if discount logic applies
// //         },
// //         include: { cartItems: true },
// //       });

// //       // Create and return the new cart item for the new cart
// //       return await this.prisma.cartItem.create({
// //         data: {
// //           product: { connect: { id: productId } },
// //           quantity,
// //           cart: { connect: { id: cart.id } },
// //         },
// //       });
// //     }

// //     // Check if the product is already in the cart
// //     const existingCartItem = cart.cartItems.find(
// //       (item) => item.productId === productId,
// //     );

// //     if (existingCartItem) {
// //       // Update the quantity of the existing cart item
// //       const updatedCartItem = await this.prisma.cartItem.update({
// //         where: { id: existingCartItem.id },
// //         data: { quantity: existingCartItem.quantity + quantity },
// //       });

// //       // Update the cart's totalPrice by adding the additional cost
// //       await this.prisma.cart.update({
// //         where: { id: cart.id },
// //         data: { totalPrice: cart.totalPrice + additionalCost },
// //       });

// //       return updatedCartItem;
// //     } else {
// //       // Create a new cart item for this product
// //       const newCartItem = await this.prisma.cartItem.create({
// //         data: {
// //           product: { connect: { id: productId } },
// //           quantity,
// //           cart: { connect: { id: cart.id } },
// //         },
// //       });

// //       // Update the cart's totalPrice by adding the additional cost
// //       await this.prisma.cart.update({
// //         where: { id: cart.id },
// //         data: { totalPrice: cart.totalPrice + additionalCost },
// //       });

// //       return newCartItem;
// //     }
// //   }

// //   async removeProductFromCart(username: string, productId: string) {
// //     // Find the user's cart using the unique username
// //     const cart = await this.prisma.cart.findFirst({
// //       where: { user: { username } },
// //       include: { cartItems: true },
// //     });

// //     if (!cart) {
// //       throw new Error('Cart not found for this user');
// //     }

// //     // Find the cart item corresponding to the given productId
// //     const cartItem = cart.cartItems.find(
// //       (item) => item.productId === productId,
// //     );
// //     if (!cartItem) {
// //       throw new Error('Product not found in cart');
// //     }

// //     // Fetch product details to calculate the removal cost
// //     const product = await this.prisma.product.findUnique({
// //       where: { id: productId },
// //       select: { price: true },
// //     });

// //     if (!product) {
// //       throw new Error('Product not found');
// //     }

// //     const removalCost = product.price * cartItem.quantity;

// //     // Remove the cart item from the cart
// //     await this.prisma.cartItem.delete({
// //       where: { id: cartItem.id },
// //     });

// //     // Update the cart's totalPrice by subtracting the cost of the removed product
// //     await this.prisma.cart.update({
// //       where: { id: cart.id },
// //       data: { totalPrice: cart.totalPrice - removalCost },
// //     });

// //     return { message: 'Product removed from cart successfully' };
// //   }
// // }

// import { Injectable, Logger } from '@nestjs/common';
// import { PrismaService } from 'lib/database/prisma.service';

// @Injectable()
// export class CartService {
//   private readonly logger = new Logger(CartService.name);

//   constructor(private prisma: PrismaService) {}

//   // Retrieves the cart for a given user (by username)
//   async getCart(username: string) {
//     try {
//       // Find the cart by linking through the User record (using the username)
//       const cart = await this.prisma.cart.findFirst({
//         where: { user: { username } },
//         include: {
//           cartItems: {
//             include: {
//               product: {
//                 include: {
//                   Category: true, // Include category details for each product
//                   seller: true, // Optionally include seller details if needed
//                 },
//               },
//             },
//           },
//         },
//       });

//       if (!cart) {
//         return [];
//       }

//       return cart.cartItems;
//     } catch (error) {
//       this.logger.error('Error fetching cart:', error);
//       throw error;
//     }
//   }

//   // Adds a product to the cart for a given user (by username)
//   async addProductToCart(
//     username: string,
//     productId: string,
//     quantity: number,
//   ) {
//     try {
//       // Find the cart for the user by username
//       let cart = await this.prisma.cart.findFirst({
//         where: { user: { username } },
//         include: { cartItems: true },
//       });

//       // If the cart doesn't exist, create one
//       if (!cart) {
//         const user = await this.prisma.user.findUnique({
//           where: { username },
//         });
//         if (!user) {
//           throw new Error('User not found');
//         }
//         cart = await this.prisma.cart.create({
//           data: {
//             user: { connect: { id: user.id } },
//             totalPrice: 0,
//             totalDiscountedPrice: 0,
//           },
//           include: { cartItems: true },
//         });
//       }

//       // Get product details (price)
//       const product = await this.prisma.product.findUnique({
//         where: { id: productId },
//         select: { price: true },
//       });
//       if (!product) {
//         throw new Error('Product not found');
//       }
//       const additionalCost = product.price * quantity;

//       // Check if the product already exists in the cart
//       const existingCartItem = cart.cartItems.find(
//         (item) => item.productId === productId,
//       );

//       if (existingCartItem) {
//         // Update the quantity of the existing cart item
//         const updatedCartItem = await this.prisma.cartItem.update({
//           where: { id: existingCartItem.id },
//           data: { quantity: existingCartItem.quantity + quantity },
//         });
//         // Update the cart's totalPrice
//         await this.prisma.cart.update({
//           where: { id: cart.id },
//           data: { totalPrice: cart.totalPrice + additionalCost },
//         });
//         return updatedCartItem;
//       } else {
//         // Create a new cart item
//         const newCartItem = await this.prisma.cartItem.create({
//           data: {
//             product: { connect: { id: productId } },
//             quantity,
//             cart: { connect: { id: cart.id } },
//           },
//         });
//         // Update the cart's totalPrice
//         await this.prisma.cart.update({
//           where: { id: cart.id },
//           data: { totalPrice: cart.totalPrice + additionalCost },
//         });
//         return newCartItem;
//       }
//     } catch (error) {
//       this.logger.error('Error adding product to cart:', error);
//       throw error;
//     }
//   }

//   async removeProductFromCart(username: string, productId: string) {
//     try {
//       // Find the cart for the user by username.
//       const cart = await this.prisma.cart.findFirst({
//         where: { user: { username } },
//         include: { cartItems: true },
//       });

//       if (!cart) {
//         throw new Error('Cart not found for this user');
//       }

//       // Find the cart item corresponding to the productId.
//       const cartItem = cart.cartItems.find(
//         (item) => item.productId === productId,
//       );
//       if (!cartItem) {
//         throw new Error('Product not found in cart');
//       }

//       // Fetch product details (price).
//       const product = await this.prisma.product.findUnique({
//         where: { id: productId },
//         select: { price: true },
//       });
//       if (!product) {
//         throw new Error('Product not found');
//       }

//       // Calculate new totalPrice: subtract product price once.
//       const updatedTotalPrice = cart.totalPrice - product.price;

//       if (cartItem.quantity > 1) {
//         // Decrement quantity by 1.
//         await this.prisma.cartItem.update({
//           where: { id: cartItem.id },
//           data: { quantity: cartItem.quantity - 1 },
//         });
//       } else {
//         // Quantity is 1, so delete the cart item.
//         await this.prisma.cartItem.delete({
//           where: { id: cartItem.id },
//         });
//       }

//       // Update the cart's totalPrice.
//       await this.prisma.cart.update({
//         where: { id: cart.id },
//         data: { totalPrice: updatedTotalPrice },
//       });

//       return { message: 'Product quantity decreased successfully' };
//     } catch (error) {
//       console.error('Error in removeProductFromCart:', error);
//       throw error;
//     }
//   }
// }

import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'lib/database/prisma.service';

@Injectable()
export class CartService {
  private readonly logger = new Logger(CartService.name);

  constructor(private prisma: PrismaService) {}

  // Retrieves the cart for a given user (by username)
  // async getCart(username: string) {
  //   try {
  //     const cart = await this.prisma.cart.findFirst({
  //       where: { user: { username } },
  //       include: {
  //         cartItems: {
  //           include: {
  //             product: {
  //               include: {
  //                 Category: true,
  //                 seller: true,
  //               },
  //             },
  //           },
  //         },
  //       },
  //     });
  //     if (!cart) {
  //       return [];
  //     }
  //     return cart.cartItems;
  //   } catch (error) {
  //     this.logger.error('Error fetching cart:', error);
  //     throw error;
  //   }
  // }
  async getCart(username: string) {
    try {
      const cart = await this.prisma.cart.findFirst({
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
      if (!cart) {
        return [];
      }
      return cart.cartItems;
    } catch (error) {
      if (
        error.message &&
        error.message.includes('measuringUnit') &&
        error.message.includes('null')
      ) {
        // Fetch products where measuringUnit is null.
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
        // Retry fetching the cart after fixing the data.
        const cart = await this.prisma.cart.findFirst({
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
        return cart ? cart.cartItems : [];
      } else {
        this.logger.error('Error fetching cart:', error);
        throw error;
      }
    }
  }

  // Adds a product to the cart for a given user (by username)
  async addProductToCart(
    username: string,
    productId: string,
    quantity: number,
  ) {
    try {
      // Find the cart for the user by username
      let cart = await this.prisma.cart.findFirst({
        where: { user: { username } },
        include: { cartItems: true },
      });

      // If the cart doesn't exist, create one
      if (!cart) {
        const user = await this.prisma.user.findUnique({
          where: { username },
        });
        if (!user) {
          throw new Error('User not found');
        }
        cart = await this.prisma.cart.create({
          data: {
            user: { connect: { id: user.id } },
            totalPrice: 0,
            totalDiscountedPrice: 0,
          },
          include: { cartItems: true },
        });
      }

      // Get product details (price)
      const product = await this.prisma.product.findUnique({
        where: { id: productId },
        select: { price: true },
      });
      if (!product) {
        throw new Error('Product not found');
      }
      const additionalCost = product.price * quantity;

      // Check if the product already exists in the cart
      const existingCartItem = cart.cartItems.find(
        (item) => item.productId === productId,
      );

      if (existingCartItem) {
        // Update the quantity of the existing cart item
        const updatedCartItem = await this.prisma.cartItem.update({
          where: { id: existingCartItem.id },
          data: { quantity: existingCartItem.quantity + quantity },
        });
        // Update the cart's totalPrice
        await this.prisma.cart.update({
          where: { id: cart.id },
          data: { totalPrice: cart.totalPrice + additionalCost },
        });
        return updatedCartItem;
      } else {
        // Create a new cart item
        const newCartItem = await this.prisma.cartItem.create({
          data: {
            product: { connect: { id: productId } },
            quantity,
            cart: { connect: { id: cart.id } },
          },
        });
        // Update the cart's totalPrice
        await this.prisma.cart.update({
          where: { id: cart.id },
          data: { totalPrice: cart.totalPrice + additionalCost },
        });
        return newCartItem;
      }
    } catch (error) {
      this.logger.error('Error adding product to cart:', error);
      throw error;
    }
  }

  async removeProductFromCart(username: string, productId: string) {
    try {
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

      // Fetch product details (price).
      const product = await this.prisma.product.findUnique({
        where: { id: productId },
        select: { price: true },
      });
      if (!product) {
        throw new Error('Product not found');
      }

      // Calculate new totalPrice: subtract product price once.
      const updatedTotalPrice = cart.totalPrice - product.price;

      if (cartItem.quantity > 1) {
        // Decrement quantity by 1.
        await this.prisma.cartItem.update({
          where: { id: cartItem.id },
          data: { quantity: cartItem.quantity - 1 },
        });
      } else {
        // Quantity is 1, so delete the cart item.
        await this.prisma.cartItem.delete({
          where: { id: cartItem.id },
        });
      }

      // Update the cart's totalPrice.
      await this.prisma.cart.update({
        where: { id: cart.id },
        data: { totalPrice: updatedTotalPrice },
      });

      return { message: 'Product quantity decreased successfully' };
    } catch (error) {
      console.error('Error in removeProductFromCart:', error);
      throw error;
    }
  }
}
