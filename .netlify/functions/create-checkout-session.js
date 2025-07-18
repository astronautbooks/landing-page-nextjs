const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const success_url = process.env.STRIPE_SUCCESS_URL;
const cancel_url = process.env.STRIPE_CANCEL_URL;

exports.handler = async (event) => {
  // Parse priceId from request body
  const { priceId } = JSON.parse(event.body);

  // Create Stripe Checkout session using the priceId
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'], // Enable card (for Google Pay/Apple Pay) and boleto
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url,
    cancel_url,
    locale: 'pt-BR', // Força o idioma do checkout para português brasileiro
    customer_creation: 'always', // Always create a customer to ensure email is available in webhooks
  });

  return {
    statusCode: 200,
    body: JSON.stringify({ url: session.url }),
  };
};