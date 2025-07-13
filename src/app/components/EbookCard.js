export default function EbookCard({ title, description, price, imageSrc, tag }) {
  return (
    <div className="ebook-card bg-white rounded-xl overflow-hidden shadow-md transition duration-300">
      <div className="relative">
        <img
          src={imageSrc}
          alt={title}
          className="w-full h-48 object-cover"
        />
        {tag && (
          <div className="absolute top-4 right-4 bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-medium">
            {tag}
          </div>
        )}
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-600 mb-4">{description}</p>
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold text-indigo-600">{price}</span>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-full hover:bg-indigo-700 transition">
            Adicionar ao Carrinho
          </button>
        </div>
      </div>
    </div>
  );
}
