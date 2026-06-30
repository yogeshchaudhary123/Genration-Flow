import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { AdminService } from "@/services/admin.service";
import { Role } from "@prisma/client";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") ?? "1");
  const limit = parseInt(searchParams.get("limit") ?? "10");
  const search = searchParams.get("search") ?? undefined;
  const role = (searchParams.get("role") as Role) ?? undefined;

  try {
    const data = await AdminService.getAllUsers({ page, limit, search, role });
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { userId, role } = await req.json();
    if (!userId || !role) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (userId === session.user.id) {
      return NextResponse.json({ error: "You cannot change your own role" }, { status: 400 });
    }

    const updatedUser = await AdminService.updateUserRole(userId, role as Role);
    return NextResponse.json(updatedUser);
  } catch (error: any) {
    console.error("Error updating user role:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("id");
    if (!userId) {
      return NextResponse.json({ error: "Missing user ID" }, { status: 400 });
    }

    if (userId === session.user.id) {
      return NextResponse.json({ error: "You cannot delete your own account" }, { status: 400 });
    }

    await AdminService.deleteUser(userId);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting user:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
