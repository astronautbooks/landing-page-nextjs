import { Montserrat } from "next/font/google";
import "./globals.css";
import { CartProvider } from "./CartContext";

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
  title: "LeiaMais - E-books Premium",
  description: "Descubra nossa coleção premium de e-books para transformar seu conhecimento em resultados.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className={`${fontClass} font-sans`}>
      <body className="antialiased">
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
