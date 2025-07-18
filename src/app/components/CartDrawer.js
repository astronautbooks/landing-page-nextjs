"use client";
import React, { useState } from "react";
import { useCart } from "../CartContext";

/**
 * CartDrawer displays the shopping cart as a side panel (drawer).
 * It lists all items, allows removing items, shows the total, and can be closed.
 * Props:
 *   open (boolean): whether the drawer is visible
 *   onClose (function): function to close the drawer
 */
export default function CartDrawer({ open, onClose }) {
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const [loading, setLoading] = useState(false);

  /**
   * Sends all cart items to the checkout API and redirects to Stripe Checkout.
   */
  async function handleCheckout() {
    if (cartItems.length === 0) return;
    setLoading(true);
    try {
      // Monta o array de line_items para o backend
      const items = cartItems.map(item => ({
        price: item.priceId, // Sempre o ID do preço do Stripe
        quantity: item.quantity || 1
      }));
      const response = await fetch("/.netlify/functions/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
      const data = await response.json();
      if (data?.url) {
        window.location.href = data.url;
      } else {
        alert("Erro ao redirecionar para o checkout.");
      }
    } catch (err) {
      alert("Erro ao processar o checkout.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className={`fixed inset-0 z-50 transition-all ${open ? "visible" : "invisible pointer-events-none"}`}
      aria-hidden={!open}
    >
      {/* Overlay */}
      <div
        className={`absolute inset-0 bg-black bg-opacity-40 transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`}
        onClick={onClose}
      />
      {/* Drawer panel */}
      <aside
        className={`absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold">Seu Carrinho</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-indigo-700 text-2xl font-bold px-2">×</button>
        </div>
        {/* Cart items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cartItems.length === 0 ? (
            <div className="text-center text-gray-500 mt-8">Seu carrinho está vazio.</div>
          ) : (
            cartItems.map(item => (
              <div key={item.id} className="flex items-center gap-4 border-b pb-3">
                <img src={item.cover} alt={item.title} className="w-16 h-20 object-cover rounded border" />
                <div className="flex-1">
                  <div className="font-semibold text-gray-800">{item.title}</div>
                  <div className="text-sm text-gray-500">R$ {item.price.toFixed(2)}</div>
                  <div className="flex items-center mt-2 gap-2">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1} className="px-2 py-0.5 bg-gray-200 rounded text-lg font-bold">-</button>
                    <span className="px-2">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-2 py-0.5 bg-gray-200 rounded text-lg font-bold">+</button>
                  </div>
                </div>
                <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-700 text-xl font-bold ml-2">×</button>
              </div>
            ))
          )}
        </div>
        {/* Footer */}
        <div className="p-4 border-t bg-gray-50">
          <div className="flex justify-between items-center mb-4">
            <span className="font-semibold text-lg">Total:</span>
            <span className="font-bold text-xl text-indigo-700">R$ {total.toFixed(2)}</span>
          </div>
          <button
            className="w-full bg-indigo-700 text-white py-3 rounded-lg font-bold text-lg hover:bg-indigo-800 transition mb-2 disabled:opacity-60"
            disabled={cartItems.length === 0 || loading}
            onClick={handleCheckout}
          >
            {loading ? "Processando..." : "Finalizar Compra"}
          </button>
          <button
            className="w-full text-gray-500 hover:text-red-600 text-sm mt-1"
            onClick={clearCart}
            disabled={cartItems.length === 0}
          >
            Esvaziar carrinho
          </button>
        </div>
      </aside>
    </div>
  );
} 