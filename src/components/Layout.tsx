'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from '@/hooks/useSession';
import { Can } from '@/components/Can';

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user } = useSession();
  
  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <div className="flex min-h-screen">
      {/* ── Sidebar ───────────────────────────── */}
      <aside className="w-56 bg-primary text-white flex flex-col flex-shrink-0" style={{ backgroundColor: '#0053A0' }}>
        <div className="flex justify-center p-4 border-b border-white/10">
          <Link href="/">
            <img src="/bestgov.svg" alt="BestGov" className="h-auto w-44 object-contain" />
          </Link>
        </div>

        <nav className="flex-1 p-2 flex flex-col gap-1 text-sm">
          <Link href="/" 
                className={`sidebar-link ${isActive('/') ? 'sidebar-link-active' : ''}`}>
            Início
          </Link>
          <Link href="/dashboard" 
                className={`sidebar-link ${isActive('/dashboard') ? 'sidebar-link-active' : ''}`}>
            Dashboard
          </Link>
        </nav>

        {/* botão sair – visível se logado */}
        {user && (
          <form
            action="/api/auth/logout"
            method="POST"
            className="p-2 border-t border-white/10"
          >
            <button
              type="submit"
              className="w-full text-left sidebar-link"
            >
              Sair
            </button>
          </form>
        )}

        <footer className="text-xs text-center p-2 border-t border-white/10">
          © 2025 BestGov
        </footer>
      </aside>

      {/* ── Conteúdo ──────────────────────────── */}
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}