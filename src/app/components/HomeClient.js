"use client";
import Carousel from './Carousel';
import BookCard from './BookCard';
import CartIcon from './CartIcon';
import CartDrawer from './CartDrawer';
import { useState } from 'react';
import Image from 'next/image';

export default function HomeClient({ books }) {
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <img src="/images/logo.png" alt="Astronaut Logo" className="h-16 w-auto mr-2" />
          </div>
          <div className="flex-1 flex justify-end items-center">
            <nav className="hidden md:flex space-x-8 mr-8">
              <a href="#ebooks" className="text-gray-600 hover:text-indigo-600 font-medium">E-books</a>
              <a href="#beneficios" className="text-gray-600 hover:text-indigo-600 font-medium">Benefícios</a>
              {/* <a href="#depoimentos" className="text-gray-600 hover:text-indigo-600 font-medium">Depoimentos</a> */}
              <a href="#contato" className="text-gray-600 hover:text-indigo-600 font-medium">Contato</a>
            </nav>
            {/* Cart icon aligned right */}
            <div className="flex-shrink-0">
              <CartIcon onClick={() => setCartOpen(true)} />
            </div>
          </div>
          <button className="md:hidden focus:outline-none">
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>
      </header>
      {/* Drawer do carrinho */}
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
        <div className="container mx-auto px-4 py-10 flex flex-col md:flex-row items-center">
          <div className="md:w-3/5 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Leve a <span className="text-yellow-300">Coleção Completa</span> de Livros de Colorir!</h1>
            <p className="text-xl mb-8 opacity-90">Três aventuras incríveis para estimular a criatividade das crianças. Aproveite a oferta especial da coleção!</p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <a href="#ebooks" className="bg-white text-indigo-600 font-bold py-3 px-8 rounded-full hover:bg-gray-100 transition duration-300 text-center shadow-lg">Quero a coleção!</a>
            </div>
          </div>
          <div className="md:w-2/5 flex justify-center items-center relative">
            {/* Efeito de Glow */}
            <div className="absolute w-96 h-96 bg-white bg-opacity-20 rounded-full blur-[100px] z-0"></div>
            {/* Imagem estática da colagem */}
            <Image
              src="/images/collage3.png"
              alt="Coleção de Livros de Colorir"
              width={640}
              height={480}
              priority
              className="drop-shadow-xl relative z-10 rounded-lg"
            />
          </div>
        </div>
      </section>

      {/* Sales Counter */}
      <div className="bg-indigo-50 py-6">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center space-x-4 md:space-x-12">
            <div className="text-center">
              <div className="text-indigo-600 font-bold text-3xl mb-2">100% Digital</div>
              <div className="text-gray-600">Sem Frete, Sem Espera</div>
            </div>
            <div className="text-center">
              <div className="text-indigo-600 font-bold text-3xl mb-2">Envio Imediato</div>
              <div className="text-gray-600">Receba por e-mail</div>
            </div>
          </div>
        </div>
      </div>

      {/* E-books Section - New dynamic book grid */}
      <section id="ebooks" className="py-20 bg-white scroll-mt-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">Veja o Livro por <span className="text-indigo-600">Dentro</span></h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">Escolha a melhor opção para você e comece a colorir hoje mesmo.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 justify-center items-stretch mx-auto max-w-fit">
            {books.map((book, idx) => {
              // Adapte aqui para promoções se necessário
              return <BookCard key={book.id} book={book} />;
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="beneficios" className="py-20 bg-gray-50 scroll-mt-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Por que escolher nossos e-books?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Benefícios exclusivos que vão transformar sua experiência de aprendizado.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: 'Estimula a Criatividade',
                description: 'Páginas que inspiram a imaginação e a expressão artística.',
                icon: (
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M15 3v4M13 5h4M9 17v4M7 19h4M19 17v4M17 19h4M9 3a2 2 0 00-2 2v1.28a1 1 0 00.52.88l4.96 2.48a1 1 0 00.96 0l4.96-2.48A1 1 0 0017 6.28V5a2 2 0 00-2-2H9z"/>
                  </svg>
                ),
                color: 'text-purple-500'
              },
              {
                title: 'Desenvolve a Coordenação',
                description: 'Ajuda a aprimorar a coordenação motora fina de forma divertida.',
                icon: (
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.536L15.232 5.232z"/>
                  </svg>
                ),
                color: 'text-indigo-500'
              },
              {
                title: 'Impressão Ilimitada',
                description: 'Imprima suas páginas favoritas quantas vezes quiser.',
                icon: (
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/>
                  </svg>
                ),
                color: 'text-green-500'
              },
              {
                title: 'Pagamento Seguro',
                description: 'Suas compras protegidas com Stripe, a plataforma líder mundial em pagamentos online.',
                icon: (
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <rect x="3" y="11" width="18" height="10" rx="2" strokeWidth="2" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 11V7a5 5 0 0110 0v4" />
                  </svg>
                ),
                color: 'text-yellow-500'
              }
            ].map((beneficio, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition duration-300 text-center border border-gray-200">
                <div className={`inline-block ${beneficio.color} mb-4`}>
                  {beneficio.icon}
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-800">{beneficio.title}</h3>
                <p className="text-gray-600">{beneficio.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contato" className="py-20 bg-white scroll-mt-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Entre em contato</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Fale conosco e descubra como podemos ajudar você.</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-8 max-w-2xl mx-auto">
            <div className="bg-gray-50 p-8 rounded-xl shadow-md border border-gray-200">
              <form className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome</label>
                  <input type="text" id="name" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">E-mail</label>
                  <input type="email" id="email" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700">Mensagem</label>
                  <textarea id="message" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" rows="4"></textarea>
                </div>
                <button type="submit" className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition duration-300">
                  Enviar Mensagem
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">AstronautBooks</h3>
              <p className="text-gray-400">Transforme seu conhecimento com nossos e-books premium.</p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Links Rápidos</h3>
              <ul className="space-y-2">
                <li><a href="#ebooks" className="text-gray-400 hover:text-white">E-books</a></li>
                <li><a href="#beneficios" className="text-gray-400 hover:text-white">Benefícios</a></li>
                {/* <li><a href="#depoimentos" className="text-gray-400 hover:text-white">Depoimentos</a></li> */}
                <li><a href="#contato" className="text-gray-400 hover:text-white">Contato</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Suporte</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Perguntas Frequentes</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Política de Privacidade</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Termos de Uso</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Newsletter</h3>
              <p className="text-gray-400 mb-4">Receba novidades e ofertas especiais.</p>
              <form className="flex">
                <input type="email" placeholder="Seu e-mail" className="flex-1 bg-gray-700 text-white rounded-l-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-r-md hover:bg-indigo-700">Inscrever</button>
              </form>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <p className="text-gray-400">&copy; 2025 AstronautBooks. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </main>
  );
} 