// Book data configuration for the landing page
// Each object represents a book with its images and pricing information
// The priceId is selected dynamically based on the environment (test or production)

const books = [
  {
    title: "Living in the Jungle",
    path: "/images/living-in-the-jungle",
    cover: "cover.png",
    page1: "page1.png",
    page2: "page2.png",
    price: 9.99,
    priceId: process.env.PRICE_ID_JUNGLE,
    isPromo: false
  },
  {
    title: "Living in the Jurassic",
    path: "/images/living-in-the-jurassic",
    cover: "cover.png",
    page1: "page1.png",
    page2: "page2.png",
    price: 9.99,
    priceId: process.env.PRICE_ID_JURASSIC,
    isPromo: false
  },
  {
    title: "Living in the Sea",
    path: "/images/living-in-the-sea",
    cover: "cover.png",
    page1: "page1.png",
    page2: "page2.png",
    price: 7.99,
    priceId: process.env.PRICE_ID_SEA,
    isPromo: false
  },
  {
    title: "Compre os 3 livros!",
    price: 18.98,
    oldPrice: 29.97,
    priceId: process.env.PRICE_ID_PROMO,
    isPromo: true
  }
];

export default books; 