import Link from "next/link";

/**
 * Success page shown after successful Stripe Checkout payment.
 * This page is public and does not require authentication.
 */
export default function SuccessPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-50">
      <div className="bg-white p-8 rounded-xl shadow-md text-center border border-green-200">
        <h1 className="text-3xl font-bold text-green-700 mb-4">Pagamento aprovado!</h1>
        <p className="text-lg text-gray-700 mb-6">
          Obrigado pela sua compra. Você receberá um e-mail com os detalhes do pedido em breve.
        </p>
        <Link
          href="/"
          className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg font-bold text-lg hover:bg-green-700 transition"
        >
          Voltar para a página inicial
        </Link>
      </div>
    </div>
  );
} 