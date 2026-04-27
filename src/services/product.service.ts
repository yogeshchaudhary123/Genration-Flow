import prisma from "@/lib/db/prisma";

export class ProductService {
  static async getProducts(category?: string) {
    return prisma.product.findMany({
      where: category ? { category } : {},
      orderBy: { createdAt: "desc" },
    });
  }

  static async getProductById(id: string) {
    return prisma.product.findUnique({
      where: { id },
    });
  }

  static async getFeaturedProducts(limit = 4) {
    return prisma.product.findMany({
      take: limit,
      orderBy: { createdAt: "desc" },
    });
  }
}
