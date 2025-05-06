// Importando o PrismaClient do local específico onde foi gerado
import { PrismaClient } from '../generated/prisma';

// Configuração para evitar múltiplas instâncias do Prisma Client durante hot reloading
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;