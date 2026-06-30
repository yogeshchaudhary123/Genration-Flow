import prisma from "../src/lib/db/prisma";

async function main() {
  console.log("Testing database connection...");
  try {
    const userCount = await prisma.user.count();
    console.log(`Connection successful! Total users in database: ${userCount}`);
    
    const users = await prisma.user.findMany({
      take: 5,
      select: { id: true, name: true, email: true, role: true }
    });
    console.log("Recent users:", users);
  } catch (error) {
    console.error("Database connection failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
