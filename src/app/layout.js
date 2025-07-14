import { Montserrat } from "next/font/google";
import "./globals.css";

// Configuração da fonte Montserrat
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ['300', '400', '500', '600', '700', '800'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-montserrat',
});

// Garante que a variável de fonte seja acessível globalmente
const fontClass = montserrat.variable;

export const metadata = {
  title: "LeiaMais - E-books Premium",
  description: "Descubra nossa coleção premium de e-books para transformar seu conhecimento em resultados.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className={`${fontClass} font-sans`}>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
