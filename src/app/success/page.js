"use client";
import Link from "next/link";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

console.log("Renderizando SuccessPage");

/**
 * Success page shown after successful Stripe Checkout payment.
 * This page is public and does not require authentication.
 */
export default function SuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  console.log("Valor de sessionId:", sessionId);

  useEffect(() => {
    /**
     * Only send the confirmation email if it hasn't been sent for this session_id.
     * Uses localStorage to prevent duplicate requests, even if React runs effects twice in dev.
     */
    if (sessionId && !localStorage.getItem(`emailSent_${sessionId}`)) {
      fetch("/.netlify/functions/send-order-received-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId })
      })
        .then(res => res.json())
        .then(data => {
          localStorage.setItem(`emailSent_${sessionId}`, "true");
          console.log("Resposta da função send-order-received-email:", data);
        })
        .catch(err => {
          console.error("Erro ao chamar função send-order-received-email:", err);
        });
    }
  }, [sessionId]);

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