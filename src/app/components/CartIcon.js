"use client";
import React from "react";
import { useCart } from "../CartContext";
import { ShoppingCart /*, ShoppingBag, Cart */ } from "lucide-react";

/**
 * CartIcon displays a shopping cart icon with a badge showing the total quantity of items in the cart.
 * Uses Lucide icons for a modern look.
 * To try other icons, import and use ShoppingBag or Cart from lucide-react.
 */
export default function CartIcon({ onClick }) {
  const { cartItems } = useCart();
  // Calculate total quantity of items in the cart
  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <button
      className="relative focus:outline-none"
      aria-label="Abrir carrinho"
      onClick={onClick}
      type="button"
    >
      {/* Ícone dentro de um círculo */}
      <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-700 border border-indigo-700 shadow-md">
        <ShoppingCart className="w-7 h-7 text-white" />
      </span>
      {/* Badge with total quantity */}
      {totalQuantity > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full px-2 py-0.5 shadow">
          {totalQuantity}
        </span>
      )}
    </button>
  );
} 