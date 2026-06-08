import { tool } from "ai";
import { z } from "zod/v4";
import { ProductService } from "@/services/product.service";
import { CartService } from "@/services/cart.service";
import { OrderService } from "@/services/order.service";
import prisma from "@/lib/db/prisma";

export const aiTools = {
  search_products: tool({
    description: "Search for products based on natural language query, intent, or category.",
    inputSchema: z.object({
      query: z.string().describe("The search query or description of the product wanted."),
      category: z.string().optional().describe("Optional category filter."),
      maxPrice: z.number().optional().describe("Optional maximum price filter."),
    }),
    execute: async ({ query, category, maxPrice }) => {
      let products = await ProductService.semanticSearch(query);

      if (category) {
        products = products.filter(p => p.category.toLowerCase() === category.toLowerCase());
      }

      if (maxPrice) {
        products = products.filter(p => p.price <= maxPrice);
      }

      return JSON.parse(JSON.stringify(products));
    },
  }),

  compare_products: tool({
    description: "Compare multiple products side by side.",
    inputSchema: z.object({
      productIds: z.array(z.string()).describe("List of product IDs to compare."),
    }),
    execute: async ({ productIds }) => {
      const products = await Promise.all(
        productIds.map((id: string) => ProductService.getProductById(id))
      );
      return JSON.parse(JSON.stringify(products.filter(p => p !== null)));
    },
  }),

  get_cart: tool({
    description: "Get the current user's shopping cart details.",
    inputSchema: z.object({
      userId: z.string().describe("The ID of the user."),
    }),
    execute: async ({ userId }) => {
      return JSON.parse(JSON.stringify(await CartService.getCart(userId)));
    },
  }),

  add_to_cart: tool({
    description: "Add a product to the user's cart.",
    inputSchema: z.object({
      userId: z.string().describe("The ID of the user."),
      productId: z.string().describe("The ID of the product to add."),
      quantity: z.number().default(1).describe("Number of items to add."),
    }),
    execute: async ({ userId, productId, quantity }) => {
      return JSON.parse(JSON.stringify(await CartService.addToCart(userId, productId, quantity)));
    },
  }),

  track_order: tool({
    description: "Track an order by its ID or user history.",
    inputSchema: z.object({
      userId: z.string().describe("The ID of the user."),
      orderId: z.string().optional().describe("Specific order ID to track."),
    }),
    execute: async ({ userId, orderId }) => {
      if (orderId) {
        return JSON.parse(JSON.stringify(await OrderService.getOrderById(orderId, userId)));
      }
      return JSON.parse(JSON.stringify(await OrderService.getOrders(userId)));
    },
  }),

  remember_preference: tool({
    description: "Save a user preference, style, size, or budget detail for future reference.",
    inputSchema: z.object({
      userId: z.string().describe("The ID of the user."),
      key: z.string().describe("The preference type (e.g., 'size', 'style', 'budget')."),
      value: z.string().describe("The value of the preference."),
      context: z.string().optional().describe("Optional context about why this is being saved."),
    }),
    execute: async ({ userId, key, value, context }) => {
      return JSON.parse(JSON.stringify(await prisma.aiMemory.create({
        data: { userId, key, value, context }
      })));
    },
  }),

  get_user_preferences: tool({
    description: "Retrieve saved preferences for a user to personalize recommendations.",
    inputSchema: z.object({
      userId: z.string().describe("The ID of the user."),
    }),
    execute: async ({ userId }) => {
      return JSON.parse(JSON.stringify(await prisma.aiMemory.findMany({
        where: { userId }
      })));
    },
  }),
};
