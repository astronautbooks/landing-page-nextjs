// .netlify/functions/get-books-from-stripe.js
// Serverless function to fetch all books (products) from Stripe with their active prices

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

/**
 * Netlify Function: get-books-from-stripe
 * Returns all products (books) from Stripe with their active prices.
 * Each book contains: id, name, description, images, priceId, price (in cents), currency.
 */
exports.handler = async (event) => {
  try {
    // Fetch all active products from Stripe
    const productsRes = await stripe.products.list({ active: true, limit: 100 });
    const products = productsRes.data;

    // For each product, fetch its active price
    const books = await Promise.all(products.map(async (product) => {
      // Fetch the first active price for this product
      const pricesRes = await stripe.prices.list({ product: product.id, active: true, limit: 1 });
      const price = pricesRes.data[0];
      return {
        id: product.id,
        name: product.name,
        description: product.description,
        images: product.images,
        priceId: price ? price.id : null,
        price: price ? price.unit_amount : null,
        currency: price ? price.currency : null,
        metadata: product.metadata, // <-- add this line
      };
    }));

    return {
      statusCode: 200,
      body: JSON.stringify(books),
    };
  } catch (error) {
    console.error('Error fetching books from Stripe:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch books from Stripe.' }),
    };
  }
}; 