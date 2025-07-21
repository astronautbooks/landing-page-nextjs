const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const success_url = `${process.env.NEXT_PUBLIC_SITE_URL}${process.env.STRIPE_SUCCESS_PATH}`;
const cancel_url = `${process.env.NEXT_PUBLIC_SITE_URL}${process.env.STRIPE_CANCEL_PATH}`;

exports.handler = async (event) => {
  // Parse items and email from request body
  const { items, email } = JSON.parse(event.body);

  let customerId = null;
  if (email) {
    // Tenta buscar cliente existente
    const existing = await stripe.customers.list({ email, limit: 1 });
    if (existing.data && existing.data.length > 0) {
      customerId = existing.data[0].id;
    } else {
      // Cria novo cliente
      const customer = await stripe.customers.create({ email });
      customerId = customer.id;
    }
  }

  // Cria sessão de checkout
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card', 'boleto'],
    line_items: items.map(item => ({
      price: item.price,
      quantity: item.quantity,
    })),
    mode: 'payment',
    success_url,
    cancel_url,
    locale: 'pt-BR',
    currency: 'brl',
    customer: customerId || undefined,
  });

  return {
    statusCode: 200,
    body: JSON.stringify({ url: session.url }),
  };
};