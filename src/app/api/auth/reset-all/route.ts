import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';
import { NextResponse } from 'next/server';

// ATENÇÃO: Este endpoint é apenas para uso em desenvolvimento
// Ele redefine a senha de todos os usuários para "123456"
export async function GET() {
  try {
    // Hash fixo para a senha "123456"
    const defaultPasswordHash = await hashPassword("123456");
    
    // Atualiza todos os usuários com a mesma senha
    const updated = await prisma.user.updateMany({
      data: {
        passwordHash: defaultPasswordHash
      }
    });
    
    return NextResponse.json({ 
      message: `Senhas redefinidas para ${updated.count} usuários.`,
      info: "Use a senha '123456' para qualquer usuário."
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ 
      error: "Falha ao redefinir senhas.",
      details: error instanceof Error ? error.message : "Erro desconhecido" 
    }, { status: 500 });
  }
}