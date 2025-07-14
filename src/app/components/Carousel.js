"use client";
import React, { useState } from 'react';

/**
 * Carousel component to display book covers in the header or hero section.
 * All images are stretched to match the size of the first image (default: 384x384px for h-96).
 *
 * Props:
 * - images: Array of image objects { src: string, alt: string }
 * - extraClassName: (optional) Additional Tailwind classes for the main image
 */
export default function Carousel({ images, extraClassName = "" }) {
  const [current, setCurrent] = useState(0);
  const total = images.length;

  // Fixed dimensions based on the first image (h-96 = 384px)
  const fixedWidth = 480; // px
  const fixedHeight = 640; // px

  const goToPrev = () => setCurrent((prev) => (prev === 0 ? total - 1 : prev - 1));
  const goToNext = () => setCurrent((prev) => (prev === total - 1 ? 0 : prev + 1));

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: fixedWidth, height: fixedHeight }}
    >
      <button
        onClick={goToPrev}
        aria-label="Previous cover"
        className="absolute left-2 top-1/2 -translate-y-1/2 z-20 p-2 bg-white bg-opacity-70 rounded-full shadow hover:bg-opacity-100 transition"
      >
        <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
      </button>
      <img
        src={images[current].src}
        alt={images[current].alt}
        className={`rounded-lg border border-white border-opacity-75 z-10 ${extraClassName}`}
        style={{ width: fixedWidth, height: fixedHeight, objectFit: 'fill' }}
      />
      <button
        onClick={goToNext}
        aria-label="Next cover"
        className="absolute right-2 top-1/2 -translate-y-1/2 z-20 p-2 bg-white bg-opacity-70 rounded-full shadow hover:bg-opacity-100 transition"
      >
        <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
      </button>
    </div>
  );
} 