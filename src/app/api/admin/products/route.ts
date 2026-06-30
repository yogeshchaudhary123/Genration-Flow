import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { AdminService } from "@/services/admin.service";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") ?? "1");
  const limit = parseInt(searchParams.get("limit") ?? "10");
  const search = searchParams.get("search") ?? undefined;
  const category = searchParams.get("category") ?? undefined;

  try {
    const data = await AdminService.getAllProducts({ page, limit, search, category });
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, description, price, images, category, stock, features, colors, sizes } = body;

    if (!name || !description || price === undefined || !images || !category || stock === undefined || !features) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const product = await AdminService.createProduct({
      name,
      description,
      price: parseFloat(price),
      images,
      category,
      stock: parseInt(stock),
      features,
      colors: colors || "",
      sizes: sizes || "",
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error: any) {
    console.error("Error creating product:", error);
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
    const { id, name, description, price, images, category, stock, features, colors, sizes } = body;

    if (!id) {
      return NextResponse.json({ error: "Missing product ID" }, { status: 400 });
    }

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = parseFloat(price);
    if (images !== undefined) updateData.images = images;
    if (category !== undefined) updateData.category = category;
    if (stock !== undefined) updateData.stock = parseInt(stock);
    if (features !== undefined) updateData.features = features;
    if (colors !== undefined) updateData.colors = colors;
    if (sizes !== undefined) updateData.sizes = sizes;

    const product = await AdminService.updateProduct(id, updateData);
    return NextResponse.json(product);
  } catch (error: any) {
    console.error("Error updating product:", error);
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
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Missing product ID" }, { status: 400 });
    }

    await AdminService.deleteProduct(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting product:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
