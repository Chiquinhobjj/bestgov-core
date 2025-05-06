'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center p-5">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Algo deu errado!</h2>
        <p className="text-gray-600 mb-6">
          {error.message || 'Ocorreu um erro ao processar sua solicitação.'}
        </p>
        <button
          onClick={reset}
          className="bg-primary text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Tentar novamente
        </button>
      </div>
    </div>
  );
}