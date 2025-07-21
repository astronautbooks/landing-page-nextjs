const mercadopago = require('mercadopago');
const { MercadoPagoConfig, Preference } = mercadopago;

const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });

const success_url = `${process.env.NEXT_PUBLIC_SITE_URL}${process.env.MP_SUCCESS_PATH}`;
const cancel_url = `${process.env.NEXT_PUBLIC_SITE_URL}${process.env.MP_CANCEL_PATH}`;
const pending_url = `${process.env.NEXT_PUBLIC_SITE_URL}${process.env.MP_PENDING_PATH}`;

/**
 * Netlify Function to create a Mercado Pago CheckoutPro preference.
 * Expects { title, price } in the POST body.
 * Returns the init_point URL for redirecting the user to the payment page.
 */
exports.handler = async (event) => {
  try {
    const { title, price, picture_url } = JSON.parse(event.body);

    const preference = {
      items: [{ title, unit_price: price, quantity: 1, picture_url }],
      back_urls: {
        success: success_url,
        failure: cancel_url,
        pending: pending_url
      },
      auto_return: 'approved'
    };

    const preferenceClient = new Preference(client);
    const { init_point } = await preferenceClient.create({ body: preference });

    return {
      statusCode: 200,
      body: JSON.stringify({ url: init_point })
    };
  } catch (error) {
    console.error("Mercado Pago error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
}; 