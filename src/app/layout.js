import { Montserrat } from "next/font/google";
import "./globals.css";
import { CartProvider } from "./CartContext";
import { Toaster } from "react-hot-toast";

// Montserrat font configuration
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ['300', '400', '500', '600', '700', '800'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-montserrat',
});

// Ensures the font variable is globally accessible
const fontClass = montserrat.variable;

export const metadata = {
  title: "AstronautBooks - E-books Premium",
  description: "Descubra nossa coleção premium de e-books para transformar seu conhecimento em resultados.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className={`${fontClass} font-sans`}>
      <body className="antialiased">
        <CartProvider>
          {children}
        </CartProvider>
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
