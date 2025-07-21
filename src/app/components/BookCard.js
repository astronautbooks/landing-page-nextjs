"use client";
import React, { useState, useRef } from "react";
import { useStripeCheckout } from "../hooks/useStripeCheckout";
import { useMercadoPagoCheckout } from "../hooks/useMercadoPagoCheckout";
import { useCart } from "../CartContext";
import toast from "react-hot-toast";
import { CheckCircle } from 'lucide-react';

export default function BookCard({ book }) {
  // Array of all images (cover + pages) vindos dos metadados do Stripe
  const images = [
    book.metadata?.cover,
    book.metadata?.page1,
    book.metadata?.page2,
    book.metadata?.page3,
    book.metadata?.page4,
    book.metadata?.page5,
  ].filter(Boolean);
  const [selected, setSelected] = useState(0); // 0 = cover
  const [hiddenIdxs, setHiddenIdxs] = useState([]); // Índices das imagens que deram erro
  const [added, setAdded] = useState(false); // Estado para feedback do botão
  const { handleBuy, loading } = useStripeCheckout();
  const { handleMpBuy, loading: mpLoading } = useMercadoPagoCheckout();
  const { addToCart, cartIconRef, cartItems } = useCart();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const coverImgRef = useRef(null); // Ref para a imagem da capa

  const isInCart = cartItems.some(item => item.id === book.id);

  // Helper to get full image path
  const getImgPath = (img) => img;

  // Preço e priceId vindos do Stripe
  const price = book.price || 0;
  const priceId = book.priceId || "";

  // Função para animar a imagem da capa até o carrinho
  function animateFlyToCart() {
    if (!coverImgRef.current || !cartIconRef?.current) return;
    const imgRect = coverImgRef.current.getBoundingClientRect();
    const cartRect = cartIconRef.current.getBoundingClientRect();

    // Cria um clone da imagem
    const clone = coverImgRef.current.cloneNode(true);
    clone.style.position = 'fixed';
    clone.style.left = imgRect.left + 'px';
    clone.style.top = imgRect.top + 'px';
    clone.style.width = imgRect.width + 'px';
    clone.style.height = imgRect.height + 'px';
    clone.style.zIndex = 9999;
    clone.style.pointerEvents = 'none';
    clone.style.transition = 'all 0.8s cubic-bezier(0.4,1,0.6,1), opacity 0.8s cubic-bezier(0.4,1,0.6,1)';
    document.body.appendChild(clone);

    // Força reflow para garantir que o transition funcione
    void clone.offsetWidth;

    // Tamanho final do clone (pequeno, para sumir no carrinho)
    const finalWidth = 0;
    const finalHeight = 0;

    // Calcula o destino para o centro do carrinho
    const cartCenterX = cartRect.left + cartRect.width / 2;
    const cartCenterY = cartRect.top + cartRect.height / 2;
    // O centro do clone final deve coincidir com o centro do carrinho
    const destX = cartCenterX - finalWidth / 2;
    const destY = cartCenterY - finalHeight / 2;

    // Aplica a transformação
    clone.style.left = destX + 'px';
    clone.style.top = destY + 'px';
    clone.style.width = finalWidth + 'px';
    clone.style.height = finalHeight + 'px';
    clone.style.opacity = '0';

    // Remove o clone após a animação
    clone.addEventListener('transitionend', () => {
      clone.remove();
    });
  }

  return (
    <div className="bg-white rounded-xl shadow-[0_4px_24px_rgba(67,56,202,0.12)] p-4 flex flex-col items-center w-80 h-full border border-gray-200">
      {/* Main image */}
      <img
        ref={coverImgRef}
        src={getImgPath(images[selected])}
        alt={book.name || book.title}
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
          const priceStr = (price / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
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
        className="bg-indigo-700 text-white px-6 py-2 rounded-md font-bold text-lg hover:bg-[#3730a3] transition shadow disabled:opacity-60 disabled:cursor-not-allowed w-full flex items-center justify-center gap-2"
        onClick={() => {
          addToCart({
            id: book.id,
            title: book.name || book.title,
            price: price / 100,
            cover: images[0],
            priceId: priceId
          });
          toast.success('Produto adicionado ao carrinho!');
          setAdded(true);
          setTimeout(() => setAdded(false), 1000);
          animateFlyToCart();
        }}
        disabled={added || isInCart}
      >
        {isInCart ? (
          <>
            No Carrinho!
            <CheckCircle className="w-5 h-5 ml-2" strokeWidth={2} fill="none" />
          </>
        ) : (added ? '✔️ No Carrinho!' : 'Adicionar ao Carrinho')}
      </button>
    </div>
  );
} 