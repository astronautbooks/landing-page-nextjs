import EbookCard from '@/components/EbookCard';
import HeroImage from '@/components/HeroImage';
import Carousel from './components/Carousel';
import books from './booksData';
import BookCard from './components/BookCard';
import BookPromoCard from './components/BookPromoCard';

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <img src="/images/logo.png" alt="Astronaut Logo" className="h-16 w-auto mr-2" />
          </div>
          <nav className="hidden md:flex space-x-8">
            <a href="#ebooks" className="text-gray-600 hover:text-indigo-600 font-medium">E-books</a>
            <a href="#beneficios" className="text-gray-600 hover:text-indigo-600 font-medium">Benefícios</a>
            <a href="#depoimentos" className="text-gray-600 hover:text-indigo-600 font-medium">Depoimentos</a>
            <a href="#contato" className="text-gray-600 hover:text-indigo-600 font-medium">Contato</a>
          </nav>
          <button className="md:hidden focus:outline-none">
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>
      </header>

      {/* Hero Section */}
            <section className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
          <div className="md:w-3/5 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Solte a Imaginação com Nossos Livros de <span className="text-yellow-300">Colorir</span> Infantis!</h1>
            <p className="text-xl mb-8 opacity-90">Dezenas de desenhos encantadores, prontos para serem transformados em obras de arte pelos pequenos artistas.</p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <a href="#ebooks" className="bg-white text-indigo-600 font-bold py-3 px-8 rounded-full hover:bg-gray-100 transition duration-300 text-center shadow-lg">Quero Colorir Agora!</a>
            </div>
          </div>
          <div className="md:w-2/5 flex justify-center items-center relative">
            {/* Efeito de Glow */}
            <div className="absolute w-96 h-96 bg-white bg-opacity-20 rounded-full blur-[100px] z-0"></div>
            {/* Carousel with book covers in Hero Section */}
            <Carousel
              images={[
                { src: '/images/living-in-the-jungle/cover.png', alt: 'Living in the Jungle Book Cover' },
                { src: '/images/living-in-the-jurassic/cover.png', alt: 'Living in the Jurassic Book Cover' },
                { src: '/images/living-in-the-sea/cover.png', alt: 'Living in the Sea Book Cover' },
              ]}
              extraClassName="rounded-lg h-96 w-auto relative z-10 border border-white border-opacity-75"
            />
          </div>
        </div>
      </section>

      {/* Sales Counter */}
      <div className="bg-indigo-50 py-6">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center space-x-4 md:space-x-12">
            <div className="text-center">
              <div className="text-indigo-600 font-bold text-3xl mb-2">+3.500</div>
              <div className="text-gray-600">E-books Vendidos</div>
            </div>
            <div className="text-center">
              <div className="text-purple-600 font-bold text-3xl mb-2">92%</div>
              <div className="text-gray-600">Satisfação dos Clientes</div>
            </div>
            <div className="text-center">
              <div className="text-indigo-600 font-bold text-3xl mb-2">100% Digital</div>
              <div className="text-gray-600">Sem Frete, Sem Espera</div>
            </div>
          </div>
        </div>
      </div>

      {/* E-books Section - New dynamic book grid */}
      <section id="ebooks" className="py-20 bg-white scroll-mt-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">Veja o Livro por <span className="text-indigo-600">Dentro</span></h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">Escolha a melhor opção para você e comece a colorir hoje mesmo.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {books.map((book, idx) => {
              if (book.isPromo) {
                // Pega as capas dos três primeiros livros não promocionais
                const covers = books.filter(b => !b.isPromo).map(b => `${b.path}/${b.cover}`);
                return <BookPromoCard key={book.title + idx} promo={book} covers={covers} />;
              }
              return <BookCard key={book.title + idx} book={book} />;
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

      {/* Testimonials Section */}
      <section id="depoimentos" className="py-20 bg-white scroll-mt-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">O que nossos clientes dizem</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Veja como nossos e-books transformaram a vida de outros leitores.</p>
          </div>
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                name: 'Maria Silva',
                role: 'Empreendedora',
                avatarUrl: 'https://placehold.co/40x40',
                quote: 'Os e-books da Astronaut foram fundamentais para o meu negócio. O conteúdo prático e atualizado me ajudou a tomar decisões mais assertivas.'
              },
              {
                name: 'João Oliveira',
                role: 'Desenvolvedor',
                avatarUrl: 'https://placehold.co/40x40',
                quote: 'Adorei o formato dos e-books! O conteúdo é bem organizado e fácil de entender, mesmo para quem não é especialista no assunto.'
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-gray-50 p-8 rounded-xl shadow-md">
                <div className="flex items-center mb-4">
                  <img src={testimonial.avatarUrl} alt={`Foto de ${testimonial.name}`} className="w-12 h-12 rounded-full" />
                  <div className="ml-4">
                    <h4 className="font-bold text-gray-800">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-600 italic">"{testimonial.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contato" className="py-20 bg-gray-50 scroll-mt-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Entre em contato</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Fale conosco e descubra como podemos ajudar você.</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
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
            <div className="bg-gray-50 p-8 rounded-xl shadow-md border border-gray-200">
              <div className="space-y-8">
                <div className="flex items-start">
                  <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mr-4 flex-shrink-0">
                    <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">Endereço</h4>
                    <p className="text-gray-600">Rua da Conhecimento, 123<br/>São Paulo - SP</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mr-4 flex-shrink-0">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">Telefone</h4>
                    <p className="text-gray-600">(11) 99999-9999</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mr-4 flex-shrink-0">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">E-mail</h4>
                    <p className="text-gray-600">astronaut@gmail.com</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Astronaut</h3>
              <p className="text-gray-400">Transforme seu conhecimento com nossos e-books premium.</p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Links Rápidos</h3>
              <ul className="space-y-2">
                <li><a href="#ebooks" className="text-gray-400 hover:text-white">E-books</a></li>
                <li><a href="#beneficios" className="text-gray-400 hover:text-white">Benefícios</a></li>
                <li><a href="#depoimentos" className="text-gray-400 hover:text-white">Depoimentos</a></li>
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
            <p className="text-gray-400">&copy; 2025 Astronaut. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
