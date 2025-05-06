'use client';

import React, { useState, useEffect } from 'react';
import { Can } from '@/components/Can';

// Definindo tipos manualmente para uso no client

type RequestWithUser = {
  id: number;
  title: string;
  details: string;
  status: 'NEW' | 'IN_PROGRESS' | 'WAITING_INFO' | 'DONE';
  openedBy: { id: number; name: string; email: string };
  createdAt: string;
  dueAt: string | null;
};

export default function Dashboard() {
  /* ───────── state ───────── */
  const [requests, setRequests] = useState<RequestWithUser[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);
  const [showOverdueOnly, setShowOverdueOnly] = useState(false);

  // edição de prazo
  const [editingId, setEditingId] = useState<number | null>(null);
  const [dueInput,  setDueInput]  = useState('');

  /* ───────── helpers ───────── */
  const getStatusColor = (s: RequestWithUser['status']) => ({
    NEW          : 'bg-blue-100 text-blue-800',
    IN_PROGRESS  : 'bg-yellow-100 text-yellow-800',
    WAITING_INFO : 'bg-orange-100 text-orange-800',
    DONE         : 'bg-green-100 text-green-800',
  }[s] ?? 'bg-gray-100');

  const getStatusText = (s: RequestWithUser['status']) => ({
    NEW          : 'Novo',
    IN_PROGRESS  : 'Em andamento',
    WAITING_INFO : 'Aguard. info',
    DONE         : 'Concluído',
  }[s] ?? s);

  const fmt = (d?: string | Date | null) =>
    d ? new Date(d).toLocaleDateString('pt-BR') : '-';

  const isOverdue = (r: RequestWithUser) =>
    r.dueAt && r.status !== 'DONE' && new Date(r.dueAt) < new Date();

  /* ───────── effects ───────── */
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          showOverdueOnly ? '/api/requests/overdue' : '/api/requests'
        );
        
        if (!response.ok) throw new Error();
        setRequests(await response.json());
      } catch {
        setError('Não foi possível carregar as requisições.');
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [showOverdueOnly]);

  /* ───────── actions ───────── */
  const advance = async (id: number) => {
    try {
      const res = await fetch(`/api/requests/${id}`, { method: 'POST' });
      if (!res.ok) throw new Error();
      const upd = await res.json();
      setRequests(r => r.map(req => req.id === id ? upd : req));
    } catch {
      setError('Falha ao avançar status.');
    }
  };

  const saveDue = async (id: number) => {
    if (!dueInput) return;
    try {
      const res = await fetch(`/api/requests/${id}`, {
        method : 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body   : JSON.stringify({ dueAt: new Date(dueInput).toISOString() }),
      });
      if (!res.ok) throw new Error();
      const upd = await res.json();
      setRequests(r => r.map(req => req.id === id ? upd : req));
      setEditingId(null); setDueInput('');
    } catch {
      setError('Falha ao gravar o prazo.');
    }
  };

  /* ───────── render ───────── */
  if (loading) return <p className="p-8 text-center">Carregando…</p>;
  if (error)   return <p className="p-8 text-center text-red-600">{error}</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Dashboard de Requisições</h1>

      <div className="mb-4 flex items-center gap-2">
        <label className="text-sm flex items-center gap-1">
          <input
            type="checkbox"
            checked={showOverdueOnly}
            onChange={() => setShowOverdueOnly(!showOverdueOnly)}
            className="accent-primary"
          />
          Mostrar apenas atrasados
        </label>
      </div>

      {requests.length === 0 ? (
        <div className="bg-gray-50 p-8 rounded text-center">
          {showOverdueOnly 
            ? "Não há requisições atrasadas no momento." 
            : "Nenhuma requisição cadastrada."}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">ID</th>
                <th className="px-4 py-2 text-left">Título</th>
                <th className="px-4 py-2 text-left">Detalhes</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Solicitante</th>
                <th className="px-4 py-2 text-left">Data</th>
                <th className="px-4 py-2 text-left">Prazo</th>
                <th className="px-4 py-2 text-left">Ações</th>
              </tr>
            </thead>

            <tbody>
              {requests.map(r => (
                <tr key={r.id}
                    className={`hover:bg-gray-50 ${isOverdue(r) ? 'bg-red-50' : ''}`}>
                  <td className="px-4 py-2 border-b">{r.id}</td>
                  <td className="px-4 py-2 border-b">{r.title}</td>
                  <td className="px-4 py-2 border-b">{r.details}</td>
                  <td className="px-4 py-2 border-b">
                    <span className={`px-2 py-0.5 rounded-full ${getStatusColor(r.status)}`}>
                      {getStatusText(r.status)}
                    </span>
                  </td>
                  <td className="px-4 py-2 border-b">{r.openedBy.name}</td>
                  <td className="px-4 py-2 border-b">{fmt(r.createdAt)}</td>

                  {/* prazo (dueAt) */}
                  <td className="px-4 py-2 border-b">
                    {editingId === r.id ? (
                      <div className="flex gap-1 items-center">
                        <input  type="date"
                                value={dueInput}
                                onChange={e => setDueInput(e.target.value)}
                                className="border rounded px-1 py-0.5" />
                        <button onClick={() => saveDue(r.id)}
                                className="text-green-600 text-xs">OK</button>
                        <button onClick={() => { setEditingId(null); setDueInput(''); }}
                                className="text-gray-500 text-xs">X</button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1">
                        <span className={isOverdue(r) ? 'text-red-600 font-medium' : ''}>
                          {fmt(r.dueAt)}
                        </span>
                        <button onClick={() => {
                                  setEditingId(r.id);
                                  setDueInput(r.dueAt
                                    ? new Date(new Date(r.dueAt)
                                      .getTime() - new Date().getTimezoneOffset()*60000)
                                      .toISOString().split('T')[0]
                                    : '');
                                }}
                                className="text-blue-600 hover:underline text-xs">editar</button>
                        {isOverdue(r) && (
                          <span className="bg-red-100 text-red-700 px-1 py-0.5 rounded text-[10px]">
                            Atrasado
                          </span>
                        )}
                      </div>
                    )}
                  </td>

                  {/* ações */}
                  <td className="py-2 px-4 border-b">
                    <Can role={['ADMIN', 'AGENT']}>
                      <button onClick={() => advance(r.id)}
                              disabled={r.status === 'DONE'}
                              className={`px-3 py-1 rounded ${
                                r.status === 'DONE'
                                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                  : 'bg-primary text-white hover:bg-blue-700'
                              }`}>
                        {r.status === 'DONE' ? 'Concluído' : 'Avançar'}
                      </button>
                    </Can>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}