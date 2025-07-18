const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const success_url = process.env.STRIPE_SUCCESS_URL;
const cancel_url = process.env.STRIPE_CANCEL_URL;

exports.handler = async (event) => {
  // Parse items from request body
  const { items } = JSON.parse(event.body);

  // Create Stripe Checkout session using all items
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: items.map(item => ({
      price: item.price,
      quantity: item.quantity,
    })),
    mode: 'payment',
    success_url,
    cancel_url,
    locale: 'pt-BR',
    customer_creation: 'always',
  });

  return {
    statusCode: 200,
    body: JSON.stringify({ url: session.url }),
  };
};