export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Cabeçalho */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <div className="text-indigo-600 font-bold text-3xl mr-2">Leia<span className="text-purple-500">Mais</span></div>
            <span className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full ml-2">ONLINE</span>
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

      {/* Seção Hero */}
            <section className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Transforme seu conhecimento
com nossos <span className="text-yellow-300">e-books premium</span></h1>
            <p className="text-xl mb-8 opacity-90">Conteúdo exclusivo criado por especialistas para acelerar seu aprendizado e desenvolvimento pessoal.</p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <a href="#ebooks" className="bg-white text-indigo-600 font-bold py-3 px-8 rounded-full hover:bg-gray-100 transition duration-300 text-center shadow-lg">Comprar Agora</a>
              <a href="#contato" className="border-2 border-white text-white font-bold py-3 px-8 rounded-full hover:bg-white hover:bg-opacity-10 transition duration-300 text-center">Falar com Vendedor</a>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <img src="https://placehold.co/600x400" alt="Pilha de livros digitais coloridos em um tablet moderno com detalhes em neon" className="rounded-lg shadow-xl w-full max-w-md" />
          </div>
        </div>
      </section>

      {/* Contador de Vendas */}
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
              <div className="text-indigo-600 font-bold text-3xl mb-2">24h</div>
              <div className="text-gray-600">Entrega Imediata</div>
            </div>
          </div>
        </div>
      </div>

      {/* Seção E-books */}
      <section id="ebooks" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">Nossos <span className="text-indigo-600">E-books</span> em Destaque</h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">Selecione o e-book que mais combina com seus objetivos e dê um upgrade no seu conhecimento.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Marketing Digital para Iniciantes',
                description: 'Domine as técnicas essenciais de marketing digital e alavanque seus negócios.',
                price: '39,90',
                oldPrice: null,
                rating: 4.9,
                reviews: 287,
                imageUrl: 'https://placehold.co/600x400',
                badge: { text: 'BESTSELLER', color: 'bg-bestseller-amber' },
                purchaseUrl: '#'
              },
              {
                title: 'Finanças Pessoais Simplificadas',
                description: 'Aprenda a controlar suas finanças, investir e construir riqueza de forma inteligente.',
                price: '49,90',
                oldPrice: null,
                rating: 4.8,
                reviews: 152,
                imageUrl: 'https://placehold.co/600x400',
                badge: { text: 'LANÇAMENTO', color: 'bg-launch-green' },
                purchaseUrl: '#'
              },
              {
                title: 'Produtividade Máxima',
                description: 'Técnicas comprovadas para fazer mais em menos tempo e com menos estresse.',
                price: '44,90',
                oldPrice: '59,90',
                rating: 4.7,
                reviews: 310,
                imageUrl: 'https://placehold.co/600x400',
                badge: { text: 'PROMOÇÃO', color: 'bg-promo-lilac' },
                purchaseUrl: '#'
              }
            ].map((ebook, index) => (
              <div key={index} className="bg-white rounded-xl overflow-hidden shadow-md transition duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col">
                <div className="relative">
                  <img className="w-full h-48 object-cover" src={ebook.imageUrl} alt={`Capa do e-book ${ebook.title}`} />
                  {ebook.badge && (
                    <div className={`absolute top-4 right-4 text-white px-3 py-1 rounded-full text-sm font-medium ${ebook.badge.color}`}>{ebook.badge.text}</div>
                  )}
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-gray-800 flex-1 pr-4">{ebook.title}</h3>
                    <div className="bg-price-lilac-light text-price-lilac-dark px-4 py-1 rounded-full font-bold text-lg whitespace-nowrap">
                      {ebook.oldPrice && (
                        <span className="line-through text-gray-400 font-normal mr-2">R$ {ebook.oldPrice}</span>
                      )}
                      R$ {ebook.price}
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4 flex-grow">{ebook.description}</p>
                  <div className="flex justify-between items-center mt-auto">
                    <div className="flex items-center text-gray-600">
                      <svg className="w-5 h-5 text-yellow-500 mr-1" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                      <span className="font-bold">{ebook.rating}</span>
                      {ebook.reviews && <span className="ml-2">({ebook.reviews} reviews)</span>}
                    </div>
                    <a href={ebook.purchaseUrl} className="bg-button-indigo hover:bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold transition duration-300">
                      Comprar
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Seção Benefícios */}
      <section id="beneficios" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Por que escolher nossos e-books?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Benefícios exclusivos que vão transformar sua experiência de aprendizado.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Acesso Imediato',
                description: 'Baixe seus e-books em segundos após a compra.',
                icon: (
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                  </svg>
                ),
                color: 'text-indigo-500'
              },
              {
                title: 'Formatos Múltiplos',
                description: 'Disponível em PDF, EPUB e MOBI para todos os dispositivos.',
                icon: (
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                  </svg>
                ),
                color: 'text-purple-500'
              },
              {
                title: 'Atualizações Gratuitas',
                description: 'Receba atualizações do conteúdo sem custo adicional.',
                icon: (
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                ),
                color: 'text-green-500'
              }
            ].map((benefit, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition duration-300 text-center">
                <div className={`inline-block ${benefit.color} mb-4`}>
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-800">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Seção Depoimentos */}
      <section id="depoimentos" className="py-20 bg-white">
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
                quote: 'Os e-books da LeiaMais foram fundamentais para o meu negócio. O conteúdo prático e atualizado me ajudou a tomar decisões mais assertivas.'
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

      {/* Seção Planos */}
      <section id="planos" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Escolha seu plano</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Planos flexíveis para atender todas as suas necessidades.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Básico',
                price: '29,90',
                period: '/mês',
                features: ['5 e-books por mês', 'Suporte básico', 'Atualizações mensais'],
                buttonText: 'Escolher Plano',
                buttonColor: 'bg-indigo-600 hover:bg-indigo-700',
                priceColor: 'text-indigo-600',
                isFeatured: false
              },
              {
                name: 'Premium',
                price: '49,90',
                period: '/mês',
                features: ['Acesso ilimitado', 'Suporte prioritário', 'Atualizações semanais', 'Conteúdo exclusivo'],
                buttonText: 'Escolher Plano',
                buttonColor: 'bg-purple-600 hover:bg-purple-700',
                priceColor: 'text-purple-600',
                isFeatured: true
              },
              {
                name: 'Empresarial',
                price: '149,90',
                period: '/mês',
                features: ['Acesso em equipe', 'Suporte 24/7 dedicado', 'Relatórios de progresso', 'Integrações customizadas'],
                buttonText: 'Entre em Contato',
                buttonColor: 'bg-gray-800 hover:bg-gray-900',
                priceColor: 'text-gray-800',
                isFeatured: false
              }
            ].map((plan, index) => (
              <div key={index} className={`bg-white rounded-xl shadow-md hover:shadow-lg transition duration-300 flex flex-col ${plan.isFeatured ? 'border-2 border-purple-600' : ''}`}>
                <div className="p-8 flex-grow">
                  <h3 className="text-2xl font-bold text-center mb-4 text-gray-800">{plan.name}</h3>
                  <div className={`text-5xl font-bold text-center ${plan.priceColor} mb-6`}>
                    <span className="text-3xl align-top">R$</span>{plan.price}
                    <span className="text-lg text-gray-600 font-medium">{plan.period}</span>
                  </div>
                  <ul className="space-y-4 text-gray-600 mb-8">
                    {plan.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-center">
                        <svg className="w-6 h-6 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-8 pt-0">
                   <a href="#contato" className={`block w-full text-center py-3 px-4 text-white rounded-lg transition duration-300 ${plan.buttonColor}`}>{plan.buttonText}</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Seção Contato */}
      <section id="contato" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Entre em contato</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Fale conosco e descubra como podemos ajudar você.</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <div className="bg-gray-50 p-8 rounded-xl shadow-md">
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
            <div className="bg-gray-50 p-8 rounded-xl shadow-md">
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
                    <p className="text-gray-600">contato@leiamais.com</p>
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
              <h3 className="text-xl font-bold mb-4">LeiaMais</h3>
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
            <p className="text-gray-400">&copy; 2024 LeiaMais. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
