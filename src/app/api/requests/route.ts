import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { add } from 'date-fns';          // pequena lib de datas (já vem no node_modules)

const SLA_MAP = {
  LOW:     { days: 7 },
  MEDIUM:  { days: 3 },
  HIGH:    { days: 1 },
  URGENT:  { hours: 4 },                // 4 h para casos urgentes
} as const;

// POST → cria requisição
export async function POST(req: Request) {
  const { title, details, priority = 'MEDIUM', openedById, dueAt } = await req.json();
  
  // se o front não mandar dueAt, calcula agora
  const slaRule = SLA_MAP[priority as keyof typeof SLA_MAP];
  const computedDue = dueAt
    ? new Date(dueAt)
    : add(new Date(), slaRule);          // date-fns soma dias/horas
  
  const request = await prisma.request.create({
    data: {
      title,
      details,
      priority,
      dueAt: computedDue,
      openedBy: {
        connect: { id: openedById }
      }
    },
    include: {
      openedBy: true
    }
  });
  
  return NextResponse.json(request, { status: 201 });
}

// GET → lista requisições
export async function GET() {
  const list = await prisma.request.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      openedBy: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    }
  });
  
  return NextResponse.json(list);
}