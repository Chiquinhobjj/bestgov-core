import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

// POST  → cria usuário
export async function POST(req: Request) {
  const { name, email, role = 'AGENT', password } = await req.json();
  if (!password) {
    return NextResponse.json({ error: 'Senha obrigatória' }, { status: 400 });
  }
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({ data: { name, email, role, passwordHash } });
  return NextResponse.json(user, { status: 201 });
}

// GET  → lista usuários
export async function GET() {
  const list = await prisma.user.findMany({ orderBy: { id: 'asc' } });
  return NextResponse.json(list);
}