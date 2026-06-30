import prisma from "@/lib/db/prisma";
import { OrderStatus, PaymentStatus, Role } from "@prisma/client";
import { ProductService } from "./product.service";

export class AdminService {
  /**
   * Get dashboard stats aggregate
   */
  static async getDashboardStats() {
    const [totalUsers, totalOrders, totalProducts, revenueAggregate] = await Promise.all([
      prisma.user.count(),
      prisma.order.count(),
      prisma.product.count(),
      prisma.payment.aggregate({
        where: { status: "COMPLETED" },
        _sum: { amount: true },
      }),
    ]);

    const totalRevenue = revenueAggregate._sum.amount ?? 0;

    // Order status breakdown
    const orderStatuses = await prisma.order.groupBy({
      by: ["status"],
      _count: { id: true },
    });

    // Recent orders (last 8)
    const recentOrders = await prisma.order.findMany({
      take: 8,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        payment: {
          select: {
            status: true,
            method: true,
          },
        },
      },
    });

    // Revenue trend (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentPayments = await prisma.payment.findMany({
      where: {
        status: "COMPLETED",
        createdAt: { gte: sevenDaysAgo },
      },
      select: {
        amount: true,
        createdAt: true,
      },
      orderBy: { createdAt: "asc" },
    });

    // Group payments by date (YYYY-MM-DD)
    const dailyRevenue: { [date: string]: number } = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      dailyRevenue[dateStr] = 0;
    }

    recentPayments.forEach((payment) => {
      const dateStr = payment.createdAt.toISOString().split("T")[0];
      if (dailyRevenue[dateStr] !== undefined) {
        dailyRevenue[dateStr] += payment.amount;
      }
    });

    const revenueTrend = Object.entries(dailyRevenue).map(([date, amount]) => ({
      date,
      amount,
    }));

    return {
      totalUsers,
      totalOrders,
      totalProducts,
      totalRevenue,
      orderStatuses: orderStatuses.map((os) => ({
        status: os.status,
        count: os._count.id,
      })),
      recentOrders,
      revenueTrend,
    };
  }

  /**
   * Users Management
   */
  static async getAllUsers(params: {
    page?: number;
    limit?: number;
    search?: string;
    role?: Role;
  }) {
    const page = params.page ?? 1;
    const limit = params.limit ?? 10;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (params.search) {
      where.OR = [
        { name: { contains: params.search } },
        { email: { contains: params.search } },
      ];
    }
    if (params.role) {
      where.role = params.role;
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          _count: {
            select: { orders: true },
          },
        },
      }),
      prisma.user.count({ where }),
    ]);

    return {
      users,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async updateUserRole(userId: string, role: Role) {
    return prisma.user.update({
      where: { id: userId },
      data: { role },
    });
  }

  static async deleteUser(userId: string) {
    return prisma.user.delete({
      where: { id: userId },
    });
  }

  /**
   * Products Management
   */
  static async getAllProducts(params: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
  }) {
    const page = params.page ?? 1;
    const limit = params.limit ?? 10;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (params.search) {
      where.OR = [
        { name: { contains: params.search } },
        { description: { contains: params.search } },
      ];
    }
    if (params.category) {
      where.category = params.category;
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.product.count({ where }),
    ]);

    return {
      products,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async createProduct(data: {
    name: string;
    description: string;
    price: number;
    images: string;
    category: string;
    stock: number;
    features: string;
    colors?: string;
    sizes?: string;
  }) {
    const product = await prisma.product.create({
      data,
    });

    // Async trigger embedding generation in background if OpenAI API is set up
    try {
      ProductService.updateProductEmbedding(product.id).catch((err) => {
        console.error("Failed to generate embedding for new product:", err);
      });
    } catch (e) {
      console.error("Embedding generation caught error:", e);
    }

    return product;
  }

  static async updateProduct(
    id: string,
    data: {
      name?: string;
      description?: string;
      price?: number;
      images?: string;
      category?: string;
      stock?: number;
      features?: string;
      colors?: string;
      sizes?: string;
    }
  ) {
    const product = await prisma.product.update({
      where: { id },
      data,
    });

    // Update embedding in background if basic info changes
    if (data.name || data.description || data.category || data.features) {
      try {
        ProductService.updateProductEmbedding(product.id).catch((err) => {
          console.error("Failed to update embedding for product:", err);
        });
      } catch (e) {
        console.error("Embedding update caught error:", e);
      }
    }

    return product;
  }

  static async deleteProduct(id: string) {
    // Delete related cart items and order items to prevent constraint errors
    await prisma.cartItem.deleteMany({ where: { productId: id } });
    
    return prisma.product.delete({
      where: { id },
    });
  }

  /**
   * Orders Management
   */
  static async getAllOrders(params: {
    page?: number;
    limit?: number;
    status?: OrderStatus;
  }) {
    const page = params.page ?? 1;
    const limit = params.limit ?? 10;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (params.status) {
      where.status = params.status;
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
          items: {
            include: {
              product: {
                select: {
                  name: true,
                  images: true,
                },
              },
            },
          },
          payment: true,
        },
      }),
      prisma.order.count({ where }),
    ]);

    return {
      orders,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Payments/Transactions
   */
  static async getAllPayments(params: {
    page?: number;
    limit?: number;
    status?: PaymentStatus;
  }) {
    const page = params.page ?? 1;
    const limit = params.limit ?? 10;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (params.status) {
      where.status = params.status;
    }

    const [payments, total] = await Promise.all([
      prisma.payment.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          order: {
            include: {
              user: {
                select: {
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
      }),
      prisma.payment.count({ where }),
    ]);

    return {
      payments,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
