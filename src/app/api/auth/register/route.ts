import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { name, email, password, role = 'AGENT' } = await req.json();

  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) {
    return NextResponse.json({ error: 'E-mail já registrado' }, { status: 400 });
  }

  const passwordHash = await hashPassword(password);
  const user = await prisma.user.create({
    data: { name, email, role, passwordHash },
  });

  return NextResponse.json({ id: user.id, email: user.email });
}