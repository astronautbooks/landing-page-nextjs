'use client';

import { useState } from 'react';

export default function EbookCard({ ebook }) {
  const [isHovered, setIsHovered] = useState(false);

  const cardStyle = {
    transition: 'all 0.3s ease-in-out',
    transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
    boxShadow: isHovered ? '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)' : '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)', // shadow-md and shadow-lg
  };

  return (
    <div 
      className="bg-white rounded-xl overflow-hidden flex flex-col border border-slate-200"
      style={cardStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative">
        <img className="w-full h-48 object-cover" src={ebook.imageUrl} alt={`Capa do e-book ${ebook.title}`} />
        {ebook.badge && (
          <span className={`absolute top-2 right-2 text-xs font-bold px-2 py-1 rounded-full ${ebook.badge.color}`}>
            {ebook.badge.text}
          </span>
        )}
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-bold mb-2">{ebook.title}</h3>
        <p className="text-sm text-gray-600 mb-4 flex-grow">{ebook.description}</p>
        <div className="flex items-center mb-4">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className={`w-4 h-4 ${i < ebook.rating ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.368 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.368-2.448a1 1 0 00-1.176 0l-3.368 2.448c-.784.57-1.838-.197-1.54-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.064 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69L9.049 2.927z" />
              </svg>
            ))}
          </div>
          <span className="text-xs text-gray-500 ml-2">{ebook.reviews} reviews</span>
        </div>
        <div className={`mt-auto pt-4 flex items-center ${ebook.price === 'Ver Galeria' ? 'justify-end' : 'justify-between'}`}>
          {ebook.price === 'Ver Galeria' ? (
            <a href={ebook.purchaseUrl} className="bg-button-indigo text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors">Ver Galeria</a>
          ) : (
            <>
              <div className={`text-lg font-bold px-3 py-1 rounded-full ${ebook.priceTheme.bg} ${ebook.priceTheme.text}`}>
                {ebook.oldPrice && <span className="text-sm line-through opacity-70 mr-2">{ebook.oldPrice}</span>}
                {ebook.price}
              </div>
              <a 
                href={ebook.purchaseUrl} 
                className="bg-button-indigo text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                {ebook.price === 'GRÁTIS' ? 'Baixar Agora' : 'Comprar Agora'}
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
