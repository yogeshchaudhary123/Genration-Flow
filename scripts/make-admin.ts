import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const email = process.argv[2];

  if (!email) {
    console.error("Please provide the user's email address.");
    console.error("Usage: npx tsx scripts/make-admin.ts <email>");
    process.exit(1);
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      console.error(`User with email "${email}" not found.`);
      process.exit(1);
    }

    const updatedUser = await prisma.user.update({
      where: { email },
      data: { role: "ADMIN" },
    });

    console.log(`Successfully promoted "${updatedUser.name || email}" to ADMIN.`);
  } catch (error) {
    console.error("Error updating user role:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
