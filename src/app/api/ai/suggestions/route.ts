import { NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";

export async function POST(req: Request) {
  try {
    const { query } = await req.json();

    // Mock AI logic: In a real app, you would call an LLM (like Gemini)
    // with the user query and the list of products to get relevant suggestions.
    
    // For now, we'll return a few products that match the query in the name/description
    const suggestions = await prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: query } },
          { description: { contains: query } },
          { category: { contains: query } },
        ],
      },
      take: 4,
    });

    return NextResponse.json({
      query,
      suggestions,
      message: suggestions.length > 0 
        ? `Found ${suggestions.length} items based on your interest.`
        : "I couldn't find exact matches, but here are some popular items you might like.",
    });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
