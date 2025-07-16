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
    <div className="bg-gray-200 shadow-[0_4px_24px_rgba(67,56,202,0.12)] border-2 border-purple-300 rounded-xl py-4 px-4 flex flex-col h-full w-80 relative">
      <div className="flex flex-col gap-y-4 flex-1 items-center justify-center">
        {/* Badge de promoção */}
        <span className="absolute top-4 right-4 bg-green-500 text-white text-sm font-bold px-4 py-1 rounded-full z-10">Promoção</span>
        {/* Deck de capas */}
        <div className="flex items-end justify-center relative h-48 mt-10">
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

        {/* Preço promocional (pill igual ao BookCard) */}
        <div className="flex items-center justify-center mb-4">
          {/* <div className="bg-yellow-200 text-yellow-900 rounded-full px-4 py-1 flex items-baseline shadow border border-yellow-300"> */}
            {(() => {
              const priceStr = promo.price.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
              const lastComma = priceStr.lastIndexOf(',');
              const inteiros = priceStr.substring(0, lastComma);
              const centavos = priceStr.substring(lastComma + 1);
              return (
                <span className="flex items-baseline justify-center">
                  <span className="text-xs font-normal relative -top-2 mr-0.5" style={{ letterSpacing: '-0.5px' }}>R$</span>
                  <span className="text-2xl font-extrabold leading-none">{inteiros}</span>
                  <span className="text-2xl font-extrabold leading-none">,</span>
                  <span className="text-xs font-bold ml-0.5" style={{ lineHeight: '1.1' }}>{centavos}</span>
                </span>
              )
            })()}
          {/* </div> */}
          {promo.oldPrice && (
            <span className="text-gray-400 flex items-baseline old-price-strike ml-4 opacity-70">
            {(() => {
                const priceStr = promo.oldPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                const lastComma = priceStr.lastIndexOf(',');
                const inteiros = priceStr.substring(0, lastComma);
                const centavos = priceStr.substring(lastComma + 1);
                return (
                <>
                    <span className="text-xs font-normal relative -top-2 mr-0.5" style={{ letterSpacing: '-0.5px' }}>R$</span>
                    <span className="text-2xl font-extrabold leading-none">{inteiros}</span>
                    <span className="text-2xl font-extrabold leading-none">,</span>
                    <span className="text-xs font-bold ml-0.5" style={{ lineHeight: '1.1' }}>{centavos}</span>
                </>
                )
            })()}
            </span>
          )}
        </div>
      </div>
      {/* Botão sempre colado na base, fora do wrapper de conteúdo principal */}
      <button
        className="bg-purple-500 text-white px-6 py-2 rounded-md font-bold text-lg hover:bg-purple-700 transition shadow disabled:opacity-60 disabled:cursor-not-allowed w-full"
        onClick={() => handleBuy(promo.priceId)}
        disabled={loading}
      >
        {loading ? "Processando..." : "Comprar Agora"}
      </button>
    </div>
  );
} 