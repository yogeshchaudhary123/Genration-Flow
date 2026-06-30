import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { AdminService } from "@/services/admin.service";
import { PaymentStatus } from "@prisma/client";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") ?? "1");
  const limit = parseInt(searchParams.get("limit") ?? "10");
  const status = (searchParams.get("status") as PaymentStatus) ?? undefined;

  try {
    const data = await AdminService.getAllPayments({ page, limit, status });
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error fetching payments:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
