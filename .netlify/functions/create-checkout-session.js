const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const success_url = process.env.STRIPE_SUCCESS_URL;
const cancel_url = process.env.STRIPE_CANCEL_URL;

exports.handler = async (event) => {
  const { price, title } = JSON.parse(event.body);

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'brl',
          product_data: {
            name: title,
          },
          unit_amount: Math.round(price * 100), // preço em centavos
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url,
    cancel_url,
  });

  return {
    statusCode: 200,
    body: JSON.stringify({ url: session.url }),
  };
};