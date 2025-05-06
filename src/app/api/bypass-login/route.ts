import { prisma } from '@/lib/prisma';
import { signToken } from '@/lib/auth';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { NextResponse } from 'next/server';

// Página especial que força login como admin sem precisar de autenticação
export async function GET() {
  try {
    // 1. Encontra ou cria usuário admin
    let admin = await prisma.user.findFirst({
      where: { email: 'admin@org.gov' }
    });
    
    if (!admin) {
      admin = await prisma.user.create({
        data: {
          name: 'Administrator',
          email: 'admin@org.gov',
          role: 'ADMIN',
          passwordHash: 'bypass-temp-hash'
        }
      });
    }
    
    // 2. Cria token JWT
    const token = signToken({ id: admin.id, role: admin.role });
    
    // 3. Define o cookie na resposta (forma correta)
    const htmlResponse = new Response(
      `<!DOCTYPE html>
      <html>
      <head>
        <title>Login Bypass</title>
        <script>
          // O redirecionamento acontecerá em 1 segundo
          setTimeout(() => {
            window.location.href = '/dashboard';
          }, 1000);
        </script>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; text-align: center; }
          .success { color: green; font-weight: bold; }
        </style>
      </head>
      <body>
        <h1>Login Automático</h1>
        <p class="success">Login realizado! Redirecionando para o dashboard...</p>
      </body>
      </html>`,
      {
        headers: {
          'content-type': 'text/html',
        },
      }
    );
    
    // Adiciona o cookie à resposta
    const cookieValue = `auth=${token}; Path=/; HttpOnly; Max-Age=${60 * 60 * 24}; SameSite=Lax`;
    htmlResponse.headers.append('Set-Cookie', cookieValue);
    
    return htmlResponse;
  } catch (error) {
    console.error('Erro no bypass de login:', error);
    return new Response(
      `Erro ao fazer login: ${error instanceof Error ? error.message : 'Desconhecido'}`,
      { status: 500 }
    );
  }
}