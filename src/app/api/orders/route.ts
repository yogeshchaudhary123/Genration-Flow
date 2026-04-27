import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { OrderService } from "@/services/order.service";
import { rateLimit, getIp } from "@/lib/rate-limit";

export async function GET(req: Request) {
  const ip = getIp(req);
  if (!rateLimit(ip, 50, 60000).success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const orderId = searchParams.get("id");

  try {
    if (orderId) {
      const order = await OrderService.getOrderById(orderId, session.user.id);
      return NextResponse.json(order);
    }

    const orders = await OrderService.getOrders(session.user.id);
    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
