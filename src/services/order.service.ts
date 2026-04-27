import prisma from "@/lib/db/prisma";
import { OrderStatus } from "@prisma/client";

export class OrderService {
  static async createOrder(userId: string, shippingAddress: string) {
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      throw new Error("Cart is empty");
    }

    const totalAmount = cart.items.reduce(
      (sum: any, item: any) => sum + item.product.price * item.quantity,
      0
    );

    // Create order and items in a transaction
    const order = await prisma.$transaction(async (tx: any) => {
      const newOrder = await tx.order.create({
        data: {
          userId,
          totalAmount,
          shippingAddress,
          status: "PENDING",
          items: {
            create: cart.items.map((item: any) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.product.price,
              color: item.color,
              size: item.size,
            })),
          },
        },
      });

      // Clear cart
      await tx.cartItem.deleteMany({
        where: { cartId: cart.id },
      });

      return newOrder;
    });

    return order;
  }

  static async getOrders(userId: string) {
    return prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        payment: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  static async getOrderById(orderId: string, userId: string) {
    return prisma.order.findFirst({
      where: { id: orderId, userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        payment: true,
      },
    });
  }

  static async updateOrderStatus(orderId: string, status: OrderStatus) {
    return prisma.order.update({
      where: { id: orderId },
      data: { status },
    });
  }
}
