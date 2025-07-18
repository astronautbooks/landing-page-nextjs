"use client";
import React, { useState } from "react";
import { useStripeCheckout } from "../hooks/useStripeCheckout";
import { useMercadoPagoCheckout } from "../hooks/useMercadoPagoCheckout";
import { useCart } from "../CartContext";

export default function BookCard({ book }) {
  // Array of all images (cover + pages)
  const images = [book.cover, book.page1, book.page2, book.page3, book.page4, book.page5].filter(Boolean);
  const [selected, setSelected] = useState(0); // 0 = cover
  const [hiddenIdxs, setHiddenIdxs] = useState([]); // Índices das imagens que deram erro
  const { handleBuy, loading } = useStripeCheckout();
  const { handleMpBuy, loading: mpLoading } = useMercadoPagoCheckout();
  const { addToCart } = useCart();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  // Helper to get full image path
  const getImgPath = (img) => img;

  // Busca o preço ativo (is_active === true) ou o primeiro preço disponível
  const activeBookPrice = book.book_prices?.find(bp => bp.price?.is_active) || book.book_prices?.[0];
  const price = activeBookPrice?.price?.price || 0;
  const priceId = activeBookPrice?.price?.id || "";

  return (
    <div className="bg-white rounded-xl shadow-[0_4px_24px_rgba(67,56,202,0.12)] p-4 flex flex-col items-center w-80 h-full border border-gray-200">
      {/* Main image */}
      <img
        src={getImgPath(images[selected])}
        alt={book.title}
        className="h-64 w-50 border border-gray-200 mb-4 object-cover object-center"
        onError={e => { e.target.style.display = 'none'; }}
      />
      {/* Thumbnails */}
      <div className="flex space-x-2 mb-4">
        {images.map((img, idx) => (
          hiddenIdxs.includes(idx) ? null : (
            <button
              key={img}
              onClick={() => setSelected(idx)}
              className={`border-2 p-0.5 transition ${selected === idx ? "border-indigo-500" : "border-transparent"}`}
              aria-label={`Show page ${idx + 1}`}
            >
              <img
                src={getImgPath(img)}
                alt={`Thumbnail ${idx + 1}`}
                className="h-12 w-auto"
                onError={() => setHiddenIdxs(prev => [...prev, idx])}
              />
            </button>
          )
        ))}
      </div>
      {/* Price pill */}
      <div className="flex items-center justify-center mb-4">
        {/* Preço profissional: R$ pequeno, inteiros grandes, vírgula, centavos pequenos */}
        {(() => {
          const priceStr = price.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
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
      </div>
      {/* Add to Cart button (only action) */}
      <button
        className="bg-indigo-700 text-white px-6 py-2 rounded-md font-bold text-lg hover:bg-[#3730a3] transition shadow disabled:opacity-60 disabled:cursor-not-allowed w-full"
        onClick={() => addToCart({
          id: book.id,
          title: book.title,
          price: price,
          cover: book.cover,
          priceId: priceId // Adiciona o ID do preço do Stripe
        })}
      >
        Adicionar ao carrinho
      </button>
    </div>
  );
} 