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
    </main>
  );
}
