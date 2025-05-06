import { prisma } from '@/lib/prisma';
import { advance } from '@/lib/utils/status';
import { NextResponse } from 'next/server';

interface RequestParams {
  params: {
    id: string;
  };
}

// GET → busca requisição específica
export async function GET(request: Request, { params }: RequestParams) {
  const id = parseInt(params.id);
  
  if (isNaN(id)) {
    return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
  }
  
  const req = await prisma.request.findUnique({
    where: { id },
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
  
  if (!req) {
    return NextResponse.json({ error: 'Requisição não encontrada' }, { status: 404 });
  }
  
  return NextResponse.json(req);
}

// PATCH → atualiza requisição
export async function PATCH(request: Request, { params }: RequestParams) {
  const id = parseInt(params.id);
  
  if (isNaN(id)) {
    return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
  }
  
  const data = await request.json();
  
  try {
    const updated = await prisma.request.update({
      where: { id },
      data,
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
    
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao atualizar requisição' }, { status: 500 });
  }
}

// POST → avança o status da requisição
export async function POST(request: Request, { params }: RequestParams) {
  const id = parseInt(params.id);
  
  if (isNaN(id)) {
    return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
  }
  
  // Busca a requisição atual
  const req = await prisma.request.findUnique({
    where: { id }
  });
  
  if (!req) {
    return NextResponse.json({ error: 'Requisição não encontrada' }, { status: 404 });
  }
  
  // Calcula o próximo status
  const nextStatus = advance(req.status);
  
  // Atualiza o status
  const updated = await prisma.request.update({
    where: { id },
    data: { 
      status: nextStatus,
      updatedAt: new Date() // Força atualização do timestamp
    },
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
  
  /* ─── NOVO: grava log ── */
  await prisma.auditLog.create({
    data: {
      requestId: updated.id,
      oldStatus: req.status,
      newStatus: updated.status,
      changedBy: req.openedById    // por ora gravamos quem abriu
    }
  });
  /* ─────────────────────── */
  
  return NextResponse.json(updated);
}

// DELETE → remove requisição
export async function DELETE(request: Request, { params }: RequestParams) {
  const id = parseInt(params.id);
  
  if (isNaN(id)) {
    return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
  }
  
  try {
    await prisma.request.delete({
      where: { id }
    });
    
    return NextResponse.json({ message: 'Requisição removida com sucesso' });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao remover requisição' }, { status: 500 });
  }
}