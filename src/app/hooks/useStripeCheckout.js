import { useState } from "react";

/**
 * Custom hook to handle Stripe Checkout session creation and redirection.
 * Usage: const { handleBuy, loading } = useStripeCheckout();
 * Call handleBuy(priceId) to start the checkout process.
 */
export function useStripeCheckout() {
  const [loading, setLoading] = useState(false);

  /**
   * Initiates Stripe Checkout for the given priceId.
   * @param {string} priceId - The Stripe price ID for the product.
   */
  const handleBuy = async (priceId) => {
    setLoading(true);
    try {
      const response = await fetch("/.netlify/functions/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId })
      });
      if (!response.ok) throw new Error("Failed to create checkout session");
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (error) {
      alert("Erro ao iniciar o checkout. Tente novamente.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return { handleBuy, loading };
} 