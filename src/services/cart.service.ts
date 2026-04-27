import prisma from "@/lib/db/prisma";

export class CartService {
  static async getCart(userId: string) {
    let cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });
    }

    return cart;
  }

  static async addToCart(userId: string, productId: string, quantity: number, color?: string, size?: string) {
    const cart = await this.getCart(userId);

    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_productId_color_size: {
          cartId: cart.id,
          productId,
          color: color || "",
          size: size || "",
        },
      },
    });

    if (existingItem) {
      return prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
      });
    }

    return prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        quantity,
        color,
        size,
      },
    });
  }

  static async updateQuantity(userId: string, itemId: string, quantity: number) {
    const cart = await this.getCart(userId);
    
    // Verify item belongs to user's cart
    const item = await prisma.cartItem.findFirst({
      where: { id: itemId, cartId: cart.id },
    });

    if (!item) throw new Error("Item not found in cart");

    if (quantity <= 0) {
      return prisma.cartItem.delete({ where: { id: itemId } });
    }

    return prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
    });
  }

  static async removeFromCart(userId: string, itemId: string) {
    const cart = await this.getCart(userId);
    
    return prisma.cartItem.deleteMany({
      where: { id: itemId, cartId: cart.id },
    });
  }

  static async clearCart(userId: string) {
    const cart = await this.getCart(userId);
    return prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });
  }
}
