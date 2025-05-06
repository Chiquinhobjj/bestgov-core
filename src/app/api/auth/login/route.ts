import { prisma } from '@/lib/prisma';
import { signToken, verifyPassword } from '@/lib/auth';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    console.log(`[LOGIN] Tentativa de login para: ${email}`);

    const user = await prisma.user.findUnique({ where: { email } });
    
    if (!user) {
      console.log(`[LOGIN] Usuário não encontrado: ${email}`);
      return NextResponse.json({ error: 'Credenciais inválidas' }, { status: 401 });
    }
    
    let passwordValid = false;
    try {
      passwordValid = await verifyPassword(password, user.passwordHash);
      console.log(`[LOGIN] Validação de senha: ${passwordValid ? 'sucesso' : 'falha'}`);
    } catch (e) {
      console.error(`[LOGIN] Erro ao verificar senha:`, e);
    }

    if (!passwordValid) {
      return NextResponse.json({ error: 'Credenciais inválidas' }, { status: 401 });
    }

    // Criando resposta primeiro
    const response = NextResponse.json({ id: user.id, role: user.role });
    
    // Adicionando o cookie à resposta diretamente
    const token = await signToken({ id: user.id, role: user.role });
    response.cookies.set('auth', token, { 
      httpOnly: true, 
      maxAge: 60 * 60 * 8, 
      path: '/',
      sameSite: 'lax'
    });
    
    console.log(`[LOGIN] Login bem-sucedido para: ${email}, role: ${user.role}`);
    return response;
  } catch (error) {
    console.error(`[LOGIN] Erro no processamento:`, error);
    return NextResponse.json({ 
      error: 'Erro no servidor', 
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 });
  }
}