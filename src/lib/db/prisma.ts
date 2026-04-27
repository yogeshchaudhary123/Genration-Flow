import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const prismaClientSingleton = () => {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is missing");

  // If using the new prisma+ protocol (Prisma 7 native), we don't need a manual driver adapter
  if (url.startsWith("prisma+")) {
    return new PrismaClient();
  }

  // Fallback for raw mysql/mariadb URLs using the adapter with increased timeout
  const dbUrl = new URL(url.replace(/^mysql:/, "http:"));
  const adapter = new PrismaMariaDb({
    host: dbUrl.hostname,
    port: parseInt(dbUrl.port) || 3306,
    user: dbUrl.username,
    password: decodeURIComponent(dbUrl.password),
    database: dbUrl.pathname.substring(1),
    connectTimeout: 30000,
  });
  
  return new PrismaClient({ adapter });
};

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prisma ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;
