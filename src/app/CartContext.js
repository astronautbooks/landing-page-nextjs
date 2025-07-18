"use client";
import React, { createContext, useContext, useState } from 'react';

/**
 * CartContext provides global state for the shopping cart.
 * It allows any component to add, remove, or update items in the cart.
 */
export const CartContext = createContext();

/**
 * CartProvider wraps your app and provides cart state to all components.
 */
export function CartProvider({ children }) {
  // Cart state: array of items { id, title, price, quantity, cover }
  const [cartItems, setCartItems] = useState([]);

  /**
   * Add a book to the cart. If it already exists, increase quantity.
   * @param {Object} book - The book object to add (must have id, title, price, cover)
   */
  function addToCart(book) {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === book.id);
      if (existing) {
        return prev.map(item =>
          item.id === book.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...book, quantity: 1 }];
    });
  }

  /**
   * Remove a book from the cart by id.
   * @param {string} id - The id of the book to remove
   */
  function removeFromCart(id) {
    setCartItems(prev => prev.filter(item => item.id !== id));
  }

  /**
   * Update the quantity of a book in the cart.
   * @param {string} id - The id of the book
   * @param {number} quantity - The new quantity
   */
  function updateQuantity(id, quantity) {
    setCartItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
      )
    );
  }

  /**
   * Clear the entire cart.
   */
  function clearCart() {
    setCartItems([]);
  }

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

/**
 * Custom hook to use the cart context easily.
 */
export function useCart() {
  return useContext(CartContext);
} 