import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { AdminService } from "@/services/admin.service";

export async function GET() {
  const session = await auth();
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const stats = await AdminService.getDashboardStats();
    return NextResponse.json(stats);
  } catch (error: any) {
    console.error("Error fetching admin stats:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
