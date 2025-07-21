"use client";
import React, { useState, useRef, useEffect } from "react";
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
  // Estado para modal de detalhes (preparar para depois)
  const [showModal, setShowModal] = useState(false);
  const [modalIdx, setModalIdx] = useState(0);

  const isInCart = cartItems.some(item => item.id === book.id);

  // Helper to get full image path
  const getImgPath = (img) => img;

  // Preço e priceId vindos do Stripe
  const price = book.price || 0;
  const priceId = book.priceId || "";

  // Metadados do Stripe
  const title = book.name || book.title;
  const summary = book.metadata?.summary || '';
  const pages = book.metadata?.pages || '';
  // Slug para buscar o PDF
  const slug = book.metadata?.slug || title.toLowerCase().replace(/ /g, '-');
  // Estado para o tamanho real do PDF
  const [pdfSize, setPdfSize] = useState('...');

  useEffect(() => {
    async function fetchPdfSize() {
      try {
        const res = await fetch(`/.netlify/functions/get-pdf-size?slug=${slug}`);
        if (res.ok) {
          const data = await res.json();
          if (data.size) {
            // Formatar para MB ou KB
            const mb = data.size / (1024 * 1024);
            setPdfSize(mb >= 1 ? `${mb.toFixed(2)} MB` : `${(data.size / 1024).toFixed(0)} KB`);
          }
        }
      } catch (err) {
        setPdfSize('N/A');
      }
    }
    fetchPdfSize();
  }, [slug]);

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
    <div className="bg-white rounded-xl shadow-[0_4px_24px_rgba(67,56,202,0.12)] p-4 flex flex-col items-stretch w-64 h-full border border-gray-200 cursor-pointer transition hover:shadow-lg" onClick={() => setShowModal(true)}>
      {/* Imagem da capa */}
      <div className="flex justify-center items-center mb-3 h-56">
        <img
          src={getImgPath(images[0])}
          alt={title}
          className="w-40 h-56 object-cover"
        />
      </div>
      {/* Título (duas linhas, truncado) */}
      <div className="text-base text-gray-900 mb-2 text-center w-full line-clamp-2" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{title}</div>
      {/* Preço */}
      <div className="flex items-center justify-center mb-2 w-full">
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
      {/* Modal de detalhes */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70" onClick={() => setShowModal(false)}>
          <div className="relative bg-white rounded-2xl p-8 shadow-2xl max-w-md w-full flex flex-col items-center" onClick={e => e.stopPropagation()}>
            {/* Botão fechar */}
            <button
              className="absolute top-4 right-4 bg-gray-100 rounded-full p-2 text-gray-700 hover:text-red-600 shadow"
              onClick={() => setShowModal(false)}
              aria-label="Fechar"
            >
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            {/* Imagem principal */}
            <img
              src={getImgPath(images[modalIdx])}
              alt={`Página ${modalIdx + 1}`}
              className="w-50 h-72 object-cover mb-4 shadow"
            />
            {/* Thumbnails centralizados */}
            <div className="flex space-x-2 mb-4 justify-center">
              {images.map((img, idx) => (
                hiddenIdxs.includes(idx) ? null : (
                  <button
                    key={img}
                    onClick={() => setModalIdx(idx)}
                    className={`border-2 p-0.5 transition ${modalIdx === idx ? "border-indigo-500 rounded-md" : "border-transparent"}`}
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
            {/* Título */}
            <div className="text-xl font-semibold text-center mb-1">{title}</div>
            {/* Descrição curta */}
            {summary && <div className="text-sm text-gray-600 text-center mb-3">{summary}</div>}
            {/* Destaques em linha */}
            <div className="flex flex-row gap-4 justify-center mb-4">
              {pages && <span className="flex items-center gap-1 text-sm"><span>🖍️</span>{pages} páginas</span>}
              <span className="flex items-center gap-1 text-sm"><span>📦</span>{pdfSize}</span>
            </div>
            {/* Preço */}
            <div className="text-2xl font-extrabold text-center mb-4">{(() => {
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
            })()}</div>
            {/* Botão adicionar ao carrinho */}
            <button
              className="w-full bg-indigo-700 text-white px-6 py-3 rounded-md font-bold text-lg hover:bg-[#3730a3] transition shadow disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
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
                setShowModal(false);
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
        </div>
      )}
    </div>
  );
} 