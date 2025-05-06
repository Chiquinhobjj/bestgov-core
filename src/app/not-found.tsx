import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-5">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <h2 className="text-2xl font-bold text-primary mb-4">Página não encontrada</h2>
        <p className="text-gray-600 mb-6">
          A página que você está procurando não existe ou foi movida.
        </p>
        <Link 
          href="/"
          className="bg-primary text-white px-4 py-2 rounded hover:bg-blue-700 transition inline-block"
        >
          Voltar para o início
        </Link>
      </div>
    </div>
  );
}