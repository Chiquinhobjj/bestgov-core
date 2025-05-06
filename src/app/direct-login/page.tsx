'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function BypassLoginPage() {
  const router = useRouter();
  const [message, setMessage] = useState('Iniciando login automático...');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function doDirectLogin() {
      try {
        setMessage('Buscando informações do usuário admin...');
        
        // 1. Encontrar o usuário admin
        const adminCheckResponse = await fetch('/api/users?email=admin@org.gov', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        
        if (!adminCheckResponse.ok) {
          throw new Error('Não foi possível verificar o usuário admin');
        }
        
        const adminData = await adminCheckResponse.json();
        let adminUser = adminData.find((user: any) => user.email === 'admin@org.gov');
        
        if (!adminUser) {
          setMessage('Usuário admin não encontrado. Criando...');
          // Se não existir, tenta criar
          const createResponse = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: 'Administrator',
              email: 'admin@org.gov',
              password: '123456',
              role: 'ADMIN'
            }),
          });
          
          if (createResponse.ok) {
            setMessage('Usuário admin criado com sucesso!');
          } else {
            // Se a criação falhar, provavelmente é porque já existe
            // Vamos apenas seguir em frente
            console.log('Nota: não foi possível criar usuário admin, provavelmente já existe');
          }
        } else {
          setMessage('Usuário admin encontrado!');
        }
        
        // 2. Fazer login diretamente
        setMessage('Fazendo login como admin...');
        const loginResponse = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: 'admin@org.gov',
            password: '123456'
          }),
        });
        
        if (!loginResponse.ok) {
          throw new Error('Falha ao fazer login como admin');
        }
        
        const loginData = await loginResponse.json();
        setMessage('Login bem-sucedido! Redirecionando...');
        
        // Pequeno atraso para garantir que o redirect aconteça
        setTimeout(() => {
          router.push('/dashboard');
        }, 1000);
        
      } catch (err) {
        console.error('Erro durante login automático:', err);
        setError(`Erro: ${err instanceof Error ? err.message : 'Desconhecido'}`);
      }
    }
    
    doDirectLogin();
  }, [router]);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-6">Login Automático</h1>
        
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-blue-700 font-medium">{message}</p>
          </div>
          
          {error && (
            <div className="p-4 bg-red-50 rounded-lg">
              <p className="text-red-700">{error}</p>
              <p className="text-red-600 mt-2">
                Verifique o console para mais detalhes.
              </p>
            </div>
          )}
          
          <button 
            onClick={() => router.push('/dashboard')}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded font-medium hover:bg-blue-700 transition"
          >
            Ir para o Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}