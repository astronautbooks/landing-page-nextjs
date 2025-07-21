"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SuccessPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/");
    }, 2500);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-50">
      <div className="bg-white p-8 rounded-xl shadow-md text-center border border-green-200 max-w-md w-full">
        <div className="flex justify-center mb-4">
          {/* Ícone de sucesso animado */}
          <svg className="w-16 h-16 text-green-500 animate-bounce" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="#d1fae5" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2l4-4" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-green-700 mb-2">Pedido recebido!</h1>
        <p className="text-base text-gray-700 mb-4">
          Recebemos seu pedido e estamos aguardando a confirmação do pagamento.<br />
          Você receberá um e-mail assim que o pagamento for aprovado.<br />
          {" "}
          <span className="text-gray-500 text-sm">Se pagou com boleto, a confirmação pode levar até 3 dias úteis.</span>
        </p>
        <div className="flex justify-center mb-2">
          {/* Loader spinner */}
          <span className="inline-block w-8 h-8 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></span>
        </div>
        <p className="mt-2 text-sm text-gray-400">
          Não quer esperar? <a href="/" className="text-green-700 underline">Voltar agora</a>
        </p>
      </div>
    </div>
  );
} 