// import { Injectable } from '@nestjs/common';
// import { PrismaService } from 'lib/database/prisma.service';

// @Injectable()
// export class ProductService {
//   constructor(private prisma: PrismaService) {}

//   // Get all products with seller and category details
//   async getAllProducts() {
//     return await this.prisma.product.findMany({
//       include: {
//         seller: true,
//         Category: true,
//       },
//     });
//   }

//   // Get products filtered by a category slug (if needed)
//   async getCategorisedProducts(categorySlug: string) {
//     return await this.prisma.product.findMany({
//       where: {
//         Category: { is: { slug: categorySlug } },
//       },
//       include: {
//         seller: true,
//         Category: true,
//       },
//     });
//   }

//   // Create a product (sell product) using seller's username and a valid category id.
//   async sellProduct(productData: {
//     name: string;
//     url: string;
//     description: string;
//     price: number;
//     sellerUsername: string;
//     categoryId?: string;
//   }) {
//     // Find the seller using the linked user's username.
//     const seller = await this.prisma.seller.findFirst({
//       where: {
//         user: { username: productData.sellerUsername },
//       },
//     });
//     if (!seller) {
//       throw new Error(
//         'Seller not found. Only a valid seller can list a product.',
//       );
//     }

//     // If categoryId is provided, verify that the category exists.
//     if (productData.categoryId) {
//       const category = await this.prisma.category.findUnique({
//         where: { id: productData.categoryId },
//       });
//       if (!category) {
//         throw new Error('Provided category does not exist.');
//       }
//     }

//     // Create the product with the provided details.
//     const product = await this.prisma.product.create({
//       data: {
//         name: productData.name,
//         url: productData.url,
//         description: productData.description,
//         price: productData.price,
//         seller: { connect: { id: seller.id } },
//         Category: productData.categoryId
//           ? { connect: { id: productData.categoryId } }
//           : undefined,
//       },
//       include: {
//         seller: true,
//         Category: true,
//       },
//     });
//     return product;
//   }

//   async findProductByName(name: string) {
//     // Convert the search term to lower case for case-insensitive comparison.
//     const searchTerm = name.trim().toLowerCase();
//     // Retrieve all products using your getAllProducts endpoint.
//     const products = await this.getAllProducts();

//     // Filter the products in memory using the includes method.
//     const filteredProducts = products.filter((product) =>
//       product.name.toLowerCase().includes(searchTerm),
//     );

//     return filteredProducts;
//   }
// }

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'lib/database/prisma.service';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  // Get all products with seller and category details
  async getAllProducts() {
    return await this.prisma.product.findMany({
      include: {
        seller: true,
        Category: true,
      },
    });
  }

  // Get products filtered by a category slug (if needed)
  async getCategorisedProducts(categorySlug: string) {
    return await this.prisma.product.findMany({
      where: {
        Category: { is: { slug: categorySlug } },
      },
      include: {
        seller: true,
        Category: true,
      },
    });
  }

  // Create a product (sell product) using seller's username and a valid category id.
  async sellProduct(productData: {
    name: string;
    url: string;
    description: string;
    price: number;
    quantity: string;
    stoploss: number;
    sellerUsername: string;
    categoryId?: string;
  }) {
    // Find the seller using the linked user's username.
    const seller = await this.prisma.seller.findFirst({
      where: {
        user: { username: productData.sellerUsername },
      },
    });
    if (!seller) {
      throw new Error(
        'Seller not found. Only a valid seller can list a product.',
      );
    }

    // If categoryId is provided, verify that the category exists.
    if (productData.categoryId) {
      const category = await this.prisma.category.findUnique({
        where: { id: productData.categoryId },
      });
      if (!category) {
        throw new Error('Provided category does not exist.');
      }
    }

    // Create the product with the provided details.
    const product = await this.prisma.product.create({
      data: {
        name: productData.name,
        url: productData.url,
        description: productData.description,
        price: productData.price,
        quantity: productData.quantity, // Now required
        stoploss: productData.stoploss, // Now required
        seller: { connect: { id: seller.id } },
        Category: productData.categoryId
          ? { connect: { id: productData.categoryId } }
          : undefined,
      },
      include: {
        seller: true,
        Category: true,
      },
    });
    return product;
  }

  async findProductByName(name: string) {
    // Convert the search term to lower case for case-insensitive comparison.
    const searchTerm = name.trim().toLowerCase();
    // Retrieve all products using your getAllProducts endpoint.
    const products = await this.getAllProducts();

    // Filter the products in memory using the includes method.
    const filteredProducts = products.filter((product) =>
      product.name.toLowerCase().includes(searchTerm),
    );

    return filteredProducts;
  }
}
