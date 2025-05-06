import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  const now = new Date();

  const list = await prisma.request.findMany({
    where: {
      dueAt: { lt: now },
      NOT: { status: 'DONE' },          // ignora concluídas
    },
    orderBy: { dueAt: 'asc' },
    include: {
      openedBy: { select: { id: true, name: true, email: true } },
    },
  });

  return NextResponse.json(list);
}