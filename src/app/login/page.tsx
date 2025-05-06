'use client';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState<string | null>(null);
  const [loading, setLoading]   = useState(false);

  const router  = useRouter();
  const search  = useSearchParams();
  const nextURL = search.get('next') || '/dashboard';

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch('/api/auth/login', {
      method : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body   : JSON.stringify({ email, password }),
    });

    if (res.ok) {
      router.replace(nextURL);
    } else {
      setError('Credenciais inválidas');
    }
    setLoading(false);
  }

  return (
    <div className="grid place-items-center min-h-screen bg-gray-50">
      <form onSubmit={handleSubmit} className="w-80 space-y-5 p-6 bg-white rounded-lg shadow">
        <h1 className="text-xl font-bold text-center">BestGov – Login</h1>

        <input
          type="email"
          placeholder="E-mail"
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        />

        <input
          type="password"
          placeholder="Senha"
          required
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        />

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 rounded text-white font-medium"
          style={{ background: '#0053A0' }}
        >
          {loading ? 'Entrando…' : 'Entrar'}
        </button>
      </form>
    </div>
  );
}