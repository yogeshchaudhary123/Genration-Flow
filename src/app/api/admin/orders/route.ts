import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { AdminService } from "@/services/admin.service";
import { OrderService } from "@/services/order.service";
import { OrderStatus } from "@prisma/client";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") ?? "1");
  const limit = parseInt(searchParams.get("limit") ?? "10");
  const status = (searchParams.get("status") as OrderStatus) ?? undefined;

  try {
    const data = await AdminService.getAllOrders({ page, limit, status });
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error fetching orders:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { orderId, status } = body;

    if (!orderId || !status) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const updatedOrder = await OrderService.updateOrderStatus(orderId, status as OrderStatus);
    return NextResponse.json(updatedOrder);
  } catch (error: any) {
    console.error("Error updating order status:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
