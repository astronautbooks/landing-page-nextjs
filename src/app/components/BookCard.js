"use client";
import React, { useState } from "react";
import { useStripeCheckout } from "../hooks/useStripeCheckout";
import { useMercadoPagoCheckout } from "../hooks/useMercadoPagoCheckout";

/**
 * BookCard component displays a book with a main image, thumbnails, price and buy button.
 * Props:
 * - book: {
 *     title: string,
 *     path: string,
 *     cover: string,
 *     page1: string,
 *     page2: string,
 *     price: number,
 *     oldPrice: number,
 *     priceId: string
 *   }
 */
export default function BookCard({ book }) {
  // Array of all images (cover + pages)
  const images = [book.cover, book.page1, book.page2];
  const [selected, setSelected] = useState(0); // 0 = cover
  const { handleBuy, loading } = useStripeCheckout();
  const { handleMpBuy, loading: mpLoading } = useMercadoPagoCheckout();
  // Always use the environment variable for the site URL
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const picture_url = `${siteUrl}${book.path}/cover-thumb.png`;

  // Helper to get full image path
  const getImgPath = (img) => `${book.path}/${img}`;

  return (
    <div className="bg-white rounded-xl shadow-[0_4px_24px_rgba(67,56,202,0.12)] p-4 flex flex-col items-center w-80 h-full border border-gray-200">
      {/* Main image */}
      <img
        src={getImgPath(images[selected])}
        alt={book.title}
        className="h-64 w-48 rounded-lg border border-gray-200 mb-4 object-cover object-center"
      />
      {/* Thumbnails */}
      <div className="flex space-x-2 mb-4">
        {images.map((img, idx) => (
          <button
            key={img}
            onClick={() => setSelected(idx)}
            className={`border-2 rounded-md p-0.5 transition ${selected === idx ? "border-indigo-500" : "border-transparent"}`}
            aria-label={`Show page ${idx + 1}`}
          >
            <img
              src={getImgPath(img)}
              alt={`Thumbnail ${idx + 1}`}
              className="h-12 w-auto rounded"
            />
          </button>
        ))}
      </div>
      {/* Price pill */}
      <div className="flex items-center justify-center mb-4">
        {/* Preço profissional: R$ pequeno, inteiros grandes, vírgula, centavos pequenos */}
        {(() => {
          const priceStr = book.price.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
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
        {book.oldPrice && (
          <span className="text-gray-400 line-through text-base ml-4">R$ {book.oldPrice.toFixed(2)}</span>
        )}
      </div>
      {/* Buy button Mercado Pago only */}
      <button
        className="bg-indigo-700 text-white px-6 py-2 rounded-md font-bold text-lg hover:bg-[#3730a3] transition shadow disabled:opacity-60 disabled:cursor-not-allowed w-full"
        style={{}}
        onClick={() => handleBuy(book.priceId)}
        disabled={loading}
      >
        {loading ? (
          "Processando..."
        ) : (
          <span className="flex flex-col items-center">Comprar Agora</span>
        )}
      </button>
    </div>
  );
} 