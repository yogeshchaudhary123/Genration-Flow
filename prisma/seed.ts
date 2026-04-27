import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import "dotenv/config";

const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL is missing");

let adapter;
if (url.startsWith("prisma+")) {
  adapter = undefined;
} else {
  const dbUrl = new URL(url.replace(/^mysql:/, "http:")); // Use http to parse as URL
  adapter = new PrismaMariaDb({
    host: dbUrl.hostname,
    port: parseInt(dbUrl.port) || 3306,
    user: dbUrl.username,
    password: decodeURIComponent(dbUrl.password),
    database: dbUrl.pathname.substring(1),
    connectTimeout: 30000,
  });
}

const prisma = adapter 
  ? new PrismaClient({ adapter }) 
  : new PrismaClient();

async function main() {
  const products = [
    {
      name: "CyberSphere Pro",
      description: "Next-gen immersive VR headset with neural haptics and 8K resolution.",
      price: 1299.99,
      category: "Electronics",
      images: "https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=800&auto=format&fit=crop&q=60",
      stock: 50,
      features: "8K Resolution, Neural Haptics, Eye Tracking, Wireless Connectivity",
    },
    {
      name: "NeonBlade Laptop",
      description: "Ultra-slim gaming powerhouse with liquid metal cooling and RGB infinity edge.",
      price: 2499.00,
      category: "Computers",
      images: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&auto=format&fit=crop&q=60",
      stock: 25,
      features: "Liquid Metal Cooling, RTX 5090, 240Hz OLED Display, Mechanical Keyboard",
    },
    {
      name: "Quantum Link Watch",
      description: "Holographic interface smartwatch with 30-day battery life.",
      price: 399.50,
      category: "Wearables",
      images: "https://images.unsplash.com/photo-1544117518-2b44c8ad89a3?w=800&auto=format&fit=crop&q=60",
      stock: 100,
      features: "Holographic UI, 30-day Battery, Solar Charging, Advanced Bio-sensors",
    },
    {
      name: "AeroPod Z",
      description: "Noise-cancelling earbuds with spatial audio and bone conduction technology.",
      price: 199.00,
      category: "Audio",
      images: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=60",
      stock: 200,
      features: "Active Noise Cancellation, Spatial Audio, Bone Conduction, 24h Battery Life",
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { id: product.name.toLowerCase().replace(/\s+/g, '-') }, // Simplified ID for seeding
      update: {},
      create: {
        ...product,
        id: product.name.toLowerCase().replace(/\s+/g, '-'),
      },
    });
  }

  console.log("Seed data created successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
