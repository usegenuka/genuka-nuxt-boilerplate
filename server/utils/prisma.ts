import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { env } from "~~/config/env";
import { PrismaClient } from "~~/prisma/generated/client";

const prismaClientSingleton = () => {
  // Create MariaDB adapter with connection configuration
  const adapter = new PrismaMariaDb({
    host: env.database.host,
    port: env.database.port,
    user: env.database.user,
    password: env.database.password,
    database: env.database.name,
    connectionLimit: 10,
    acquireTimeout: 30000,
    connectTimeout: 10000,
  });

  return new PrismaClient({
    adapter,
    log: ['error', 'warn'],
  });
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
