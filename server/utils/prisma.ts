import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { DB_DEFAULTS } from "~~/config/constants";
import { env } from "~~/config/env";
import { PrismaClient } from "~~/prisma/generated/client";

const prismaClientSingleton = () => {
  const adapter = new PrismaMariaDb({
    host: env.database.host,
    port: env.database.port,
    user: env.database.user,
    password: env.database.password,
    database: env.database.name,
    connectionLimit: DB_DEFAULTS.CONNECTION_LIMIT,
  });
  return new PrismaClient({ adapter });
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
