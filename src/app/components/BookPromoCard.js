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
    <div className="bg-gradient-to-br from-yellow-100 to-purple-100 rounded-xl shadow-lg p-6 flex flex-col items-center w-full mx-auto border-2 border-yellow-300">
      {/* Deck de capas */}
      <div className="flex items-end justify-center mb-6 relative h-48">
        <img
          src={covers[0]}
          alt="Capa 1"
          className="h-40 w-auto rounded-lg shadow-lg absolute left-0 z-10 rotate-[-12deg] border-2 border-white"
          style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.10)' }}
        />
        <img
          src={covers[1]}
          alt="Capa 2"
          className="h-48 w-auto rounded-lg shadow-lg relative z-20 border-4 border-white mx-4"
          style={{ boxShadow: '0 8px 24px rgba(0,0,0,0.13)' }}
        />
        <img
          src={covers[2]}
          alt="Capa 3"
          className="h-40 w-auto rounded-lg shadow-lg absolute right-0 z-10 rotate-[12deg] border-2 border-white"
          style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.10)' }}
        />
      </div>
      {/* Título */}
      <div className="font-extrabold text-xl text-center mb-2 text-purple-800 drop-shadow">{promo.title}</div>
      {/* Preço promocional */}
      <div className="flex items-center justify-center mb-4">
        <span className="bg-yellow-200 text-yellow-900 font-bold px-4 py-2 rounded-full text-xl mr-3 shadow">
          R$ {promo.price.toFixed(2)}
        </span>
        {promo.oldPrice && (
          <span className="text-gray-400 line-through text-lg">R$ {promo.oldPrice.toFixed(2)}</span>
        )}
      </div>
      {/* Botão de compra Mercado Pago only */}
      <button
        className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold text-lg hover:bg-blue-700 transition shadow disabled:opacity-60 disabled:cursor-not-allowed w-full"
        onClick={() => handleBuy(promo.priceId)}
        disabled={loading}
      >
        {loading ? "Processando..." : "Comprar Coleção"}
      </button>
    </div>
  );
} 