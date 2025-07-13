import { Montserrat } from "next/font/google";
import "./globals.css";

console.log("globals.css imported");

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

export const metadata = {
  title: "LeiaMais - E-books Premium",
  description: "Descubra nossa coleção premium de e-books para transformar seu conhecimento em resultados.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className={montserrat.variable}>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
