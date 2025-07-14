"use client";
import React, { useState } from "react";

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
 *     oldPrice: number
 *   }
 */
export default function BookCard({ book }) {
  // Array of all images (cover + pages)
  const images = [book.cover, book.page1, book.page2];
  const [selected, setSelected] = useState(0); // 0 = cover

  // Helper to get full image path
  const getImgPath = (img) => `${book.path}/${img}`;

  return (
    <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center w-full mx-auto">
      {/* Main image */}
      <img
        src={getImgPath(images[selected])}
        alt={book.title}
        className="h-72 w-auto rounded-lg border border-gray-200 mb-4 object-contain"
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
      {/* Title */}
      <div className="font-bold text-lg text-center mb-2">{book.title}</div>
      {/* Price */}
      <div className="flex items-center justify-center mb-4">
        <span className="bg-yellow-100 text-yellow-800 font-bold px-4 py-2 rounded-full text-lg mr-3">
          R$ {book.price.toFixed(2)}
        </span>
        {book.oldPrice && (
          <span className="text-gray-400 line-through text-base">R$ {book.oldPrice.toFixed(2)}</span>
        )}
      </div>
      {/* Buy button */}
      <button
        className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-bold text-lg hover:bg-indigo-700 transition shadow"
        disabled
      >
        Comprar Agora
      </button>
    </div>
  );
} 