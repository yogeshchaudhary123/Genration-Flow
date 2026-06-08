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

  static async semanticSearch(query: string, limit = 5) {
    const { getEmbedding, cosineSimilarity } = await import("@/lib/ai/embedding");
    
    const queryEmbedding = await getEmbedding(query);
    const products = await prisma.product.findMany({
      where: { embedding: { not: null } }
    });

    const ranked = products
      .map(p => ({
        ...p,
        similarity: cosineSimilarity(queryEmbedding, JSON.parse(p.embedding!))
      }))
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit);

    return ranked;
  }

  static async updateProductEmbedding(id: string) {
    const { getEmbedding } = await import("@/lib/ai/embedding");
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) return;

    const content = `${product.name} ${product.description} ${product.category} ${product.features}`;
    const embedding = await getEmbedding(content);

    await prisma.product.update({
      where: { id },
      data: { embedding: JSON.stringify(embedding) }
    });
  }
}
