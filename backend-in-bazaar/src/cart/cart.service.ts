import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'lib/database/prisma.service';

@Injectable()
export class CartService {
  private readonly logger = new Logger(CartService.name);

  constructor(private prisma: PrismaService) {}

  // Retrieves the cart for a given user (by username)
  async getCart(username: string) {
    try {
      // Find the cart by linking through the User record (using the username)
      const cart = await this.prisma.cart.findFirst({
        where: { user: { username } },
        include: {
          cartItems: {
            include: {
              product: {
                include: {
                  Category: true, // Include category details for each product
                  seller: true, // Optionally include seller details if needed
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
      this.logger.error('Error fetching cart:', error);
      throw error;
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
