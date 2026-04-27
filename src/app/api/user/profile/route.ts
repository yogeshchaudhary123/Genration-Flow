import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/db/prisma";
import { logger } from "@/lib/logger";

export async function GET() {
  const session = await auth();
  
  if (!session?.user?.id) {
    logger.warn("Unauthorized profile access attempt");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        image: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error: any) {
    logger.error("Error fetching user profile:", error.message);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  const session = await auth();
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { name } = await req.json();

    if (!name || typeof name !== "string") {
      return NextResponse.json({ error: "Invalid name" }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: { name },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        image: true,
      },
    });

    logger.info(`User ${session.user.id} updated profile`);

    return NextResponse.json(updatedUser);
  } catch (error: any) {
    logger.error("Error updating user profile:", error.message);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
