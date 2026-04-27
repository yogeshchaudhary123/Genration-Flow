import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { CartService } from "@/services/cart.service";
import { z } from "zod";
import { rateLimit, getIp } from "@/lib/rate-limit";

export async function GET(req: Request) {
  const ip = getIp(req);
  if (!rateLimit(ip, 100, 60000).success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const cart = await CartService.getCart(session.user.id);
    return NextResponse.json(cart);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

const addToCartSchema = z.object({
  productId: z.string(),
  quantity: z.number().int().positive(),
  color: z.string().optional(),
  size: z.string().optional(),
});

export async function POST(req: Request) {
  const ip = getIp(req);
  if (!rateLimit(ip, 50, 60000).success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { productId, quantity, color, size } = addToCartSchema.parse(body);
    const item = await CartService.addToCart(session.user.id, productId, quantity, color, size);
    return NextResponse.json(item, { status: 201 });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  const ip = getIp(req);
  if (!rateLimit(ip, 50, 60000).success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { itemId, quantity } = await req.json();
    const item = await CartService.updateQuantity(session.user.id, itemId, quantity);
    return NextResponse.json(item);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(req: Request) {
  const ip = getIp(req);
  if (!rateLimit(ip, 50, 60000).success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { itemId, clearAll } = await req.json();
    if (clearAll) {
      await CartService.clearCart(session.user.id);
    } else {
      await CartService.removeFromCart(session.user.id, itemId);
    }
    return NextResponse.json({ message: "Success" });
  } catch (error: any) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
