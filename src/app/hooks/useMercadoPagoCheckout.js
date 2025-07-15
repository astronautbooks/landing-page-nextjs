import { useState } from "react";

/**
 * Custom hook to handle Mercado Pago CheckoutPro session creation and redirection.
 * Usage: const { handleMpBuy, loading } = useMercadoPagoCheckout();
 * Call handleMpBuy({ title, price, picture_url }) to start the checkout process.
 */
export function useMercadoPagoCheckout() {
  const [loading, setLoading] = useState(false);

  /**
   * Initiates Mercado Pago CheckoutPro for the given product.
   * @param {Object} params - { title, price, picture_url }
   */
  const handleMpBuy = async ({ title, price, picture_url }) => {
    setLoading(true);
    try {
      const response = await fetch("/.netlify/functions/create-mp-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, price, picture_url })
      });
      if (!response.ok) throw new Error("Failed to create Mercado Pago checkout session");
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (error) {
      alert("Erro ao iniciar o checkout Mercado Pago. Tente novamente.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return { handleMpBuy, loading };
} 