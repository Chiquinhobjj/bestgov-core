import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { canAccess, Role } from '@/lib/rbac';

const DEV_BYPASS = false;  // <<< bypass desligado

const PUBLIC_PATHS = [
  '/',                     // Home
  '/login',                // página de login
  '/favicon.ico',
  '/bestgov-logo.ico',
];

const PUBLIC_API = [
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/reset',       // Endpoint de redefinição de senha (temporário)
  '/api/auth/reset-all',   // Endpoint para redefinir todas as senhas (temporário/dev)
  '/api/dev-auth',         // Endpoint de autenticação para desenvolvimento
];

export async function middleware(req: NextRequest) {
  if (DEV_BYPASS) return NextResponse.next();

  const { pathname } = req.nextUrl;
  const method = req.method as 'GET'|'POST'|'PATCH'|'DELETE';

  // rotas públicas continuam liberadas
  if (PUBLIC_PATHS.includes(pathname) || PUBLIC_API.some(p => pathname.startsWith(p)) ||
      pathname.startsWith('/_next') || pathname.startsWith('/public')) {
    return NextResponse.next();
  }

  // Lê o cookie `auth`
  const token = req.cookies.get('auth')?.value;
  
  try {
    // Verificação assíncrona do token
    const payload = token ? await verifyToken(token) : null;   // { id, role } | null

    if (!payload) {
      return NextResponse.redirect(new URL(`/login?next=${pathname}`, req.url));
    }

    // Verifica se o usuário tem permissão para acessar o recurso
    if (!canAccess(pathname, method, payload.role as Role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // injeta userId/role nos headers p/ API (opcional)
    const res = NextResponse.next();
    res.headers.set('x-user-id', String(payload.id));
    res.headers.set('x-user-role', payload.role);
    return res;
  } catch (error) {
    // Se houver erro na verificação do token, redireciona para o login
    return NextResponse.redirect(new URL(`/login?next=${pathname}`, req.url));
  }
}

export const config = { 
  matcher: ['/api/:path*', '/dashboard'], 
};