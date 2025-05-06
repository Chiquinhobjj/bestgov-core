import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';
import { NextResponse } from 'next/server';

// NOTA: Este é um endpoint temporário que deve ser removido em produção
// Serve apenas para redefinir a senha durante o desenvolvimento
export async function POST(req: Request) {
  const { email, password } = await req.json();

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
  }

  const passwordHash = await hashPassword(password);
  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash }
  });

  return NextResponse.json({ message: 'Senha redefinida com sucesso' });
}