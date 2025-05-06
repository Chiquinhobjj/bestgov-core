'use client';
import { ReactNode } from 'react';
import { useSession } from '@/hooks/useSession';
import { Role } from '@/lib/rbac';

interface CanProps {
  role: Role | Role[];
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Componente para renderização condicional baseada em role
 * Exemplo: <Can role="ADMIN"><button>Excluir usuário</button></Can>
 */
export function Can({ role, children, fallback = null }: CanProps) {
  const { user, loading } = useSession();
  
  // Enquanto estiver carregando, não mostra nada
  if (loading) return null;
  
  // Se o usuário não está logado, não mostra nada
  if (!user) return null;
  
  // Verificar se o usuário tem pelo menos uma das roles permitidas
  const allowedRoles = Array.isArray(role) ? role : [role];
  const hasPermission = allowedRoles.includes(user.role);
  
  return hasPermission ? <>{children}</> : <>{fallback}</>;
}