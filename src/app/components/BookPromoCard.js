"use client";
import React from "react";
import { useStripeCheckout } from "../hooks/useStripeCheckout";
import { useMercadoPagoCheckout } from "../hooks/useMercadoPagoCheckout";
import books from "../booksData";

/**
 * BookPromoCard component displays a special promo card for all books.
 * Props:
 * - promo: objeto do tipo { title, price, oldPrice }
 * - covers: array de paths das capas dos livros
 */
export default function BookPromoCard({ promo, covers }) {
  const { handleBuy, loading } = useStripeCheckout();
  const { handleMpBuy, loading: mpLoading } = useMercadoPagoCheckout();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:8888";
  const picture_url = `${siteUrl}/images/collection-thumb.png`;

  return (
    <div className="bg-yellow-50 border border-yellow-300 rounded-xl py-4 px-4 flex flex-col h-full w-80 relative">
      <div className="flex flex-col gap-y-4 flex-1 items-center justify-center">
        {/* Badge de promoção */}
        <span className="absolute top-4 right-4 bg-yellow-300 text-yellow-900 text-sm font-bold px-4 py-1 rounded-full shadow z-10">Promoção</span>
        {/* Deck de capas */}
        <div className="flex items-end justify-center relative h-48">
          <img
            src={covers[0]}
            alt="Capa 1"
            className="h-36 w-auto rounded-lg shadow-md absolute left-0 z-10 rotate-[-12deg] border-2 border-white"
            style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
          />
          <img
            src={covers[1]}
            alt="Capa 2"
            className="h-48 w-auto rounded-lg shadow-lg relative z-20 border-4 border-white mx-2"
            style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.10)' }}
          />
          <img
            src={covers[2]}
            alt="Capa 3"
            className="h-36 w-auto rounded-lg shadow-md absolute right-0 z-10 rotate-[12deg] border-2 border-white"
            style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
          />
        </div>
        {/* Título */}
        <div className="font-extrabold text-lg text-center text-purple-800 drop-shadow">{promo.title}</div>

        {/* Preço promocional */}
        <div className="flex items-end justify-center">
          <span className="bg-yellow-200 text-yellow-900 font-bold px-4 py-2 rounded-full text-lg mr-2 shadow">
            R$ {promo.price.toFixed(2)}
          </span>
          {promo.oldPrice && (
            <span className="text-gray-400 line-through text-base">R$ {promo.oldPrice.toFixed(2)}</span>
          )}
        </div>
      </div>
      {/* Botão sempre colado na base, fora do wrapper de conteúdo principal */}
      <button
        className="bg-purple-500 text-white px-6 py-3 rounded-lg font-bold text-lg hover:bg-blue-700 transition shadow disabled:opacity-60 disabled:cursor-not-allowed w-full"
        onClick={handleBuy}
        disabled={loading}
      >
        {loading ? "Processando..." : "Comprar a Coleção Completa"}
      </button>
    </div>
  );
} 