import Link from "next/link";

/**
 * Canceled page shown after Stripe Checkout payment is canceled.
 * This page is public and does not require authentication.
 */
export default function CanceledPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-red-50">
      <div className="bg-white p-8 rounded-xl shadow-md text-center border border-red-200">
        <h1 className="text-3xl font-bold text-red-700 mb-4">Pagamento não realizado</h1>
        <p className="text-lg text-gray-700 mb-6">
          O pagamento foi cancelado ou não foi concluído. Se desejar, tente novamente.
        </p>
        <Link
          href="/"
          className="inline-block bg-red-600 text-white px-6 py-3 rounded-lg font-bold text-lg hover:bg-red-700 transition"
        >
          Voltar para a página inicial
        </Link>
      </div>
    </div>
  );
} 