import { NextResponse } from "next/server";
import { ProductService } from "@/services/product.service";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const featured = searchParams.get("featured");

    if (featured === "true") {
      const products = await ProductService.getFeaturedProducts();
      return NextResponse.json(products);
    }

    const products = await ProductService.getProducts(category || undefined);
    return NextResponse.json(products);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
