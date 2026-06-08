import { PrismaClient } from "@prisma/client";
import "dotenv/config";
import OpenAI from "openai";

const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL is missing");
console.log("Database URL found, initializing Prisma...");

const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey || apiKey === "sk-...") {
  throw new Error("OPENAI_API_KEY is missing or is still the placeholder. Please set it in your .env file.");
}

const client = new OpenAI({
  apiKey: apiKey,
});

const prisma = new PrismaClient({
  datasourceUrl: url,
} as any);

async function getEmbedding(text: string) {
  const response = await client.embeddings.create({
    model: "text-embedding-3-small",
    input: text.replace(/\n/g, " "),
  });
  return response.data[0].embedding;
}

async function main() {
  const products = await prisma.product.findMany();
  console.log(`Found ${products.length} products to index.`);

  for (const product of products) {
    console.log(`Indexing ${product.name}...`);
    const content = `${product.name} ${product.description} ${product.category} ${product.features}`;
    const embedding = await getEmbedding(content);

    await prisma.product.update({
      where: { id: product.id },
      data: { embedding: JSON.stringify(embedding) }
    });
  }

  console.log("Product indexing complete!");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
