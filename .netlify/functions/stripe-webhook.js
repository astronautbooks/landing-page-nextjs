// Serverless function to handle Stripe webhooks (for boleto and other payment events)
// Place your STRIPE_WEBHOOK_SECRET in your environment variables

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
// Import Resend SDK
const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);

// Netlify provides the raw body in event.body (as a string)
exports.handler = async (event) => {
  // Stripe requires the raw body to validate the signature
  const sig = event.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let stripeEvent;
  try {
    // Validate the event came from Stripe
    stripeEvent = stripe.webhooks.constructEvent(
      event.body,
      sig,
      webhookSecret
    );
  } catch (err) {
    console.error('⚠️  Webhook signature verification failed.', err.message);
    return {
      statusCode: 400,
      body: `Webhook Error: ${err.message}`,
    };
  }

  // Handle the event
  switch (stripeEvent.type) {
    case 'payment_intent.succeeded': {
      // Payment was successful (boleto, card, etc)
      console.log('✅ Payment succeeded:', stripeEvent.data.object.id);
      const paymentIntent = stripeEvent.data.object;
      let customerEmail = paymentIntent.receipt_email || paymentIntent.charges?.data?.[0]?.billing_details?.email || paymentIntent.customer_email;
      let customerName = paymentIntent.charges?.data?.[0]?.billing_details?.name || '';
      let paymentMethod = paymentIntent.charges?.data?.[0]?.payment_method_details?.type || '';
      let cardLast4 = paymentIntent.charges?.data?.[0]?.payment_method_details?.card?.last4 || '';
      let boletoUrl = paymentIntent.charges?.data?.[0]?.payment_method_details?.boleto?.url || '';
      let pixInfo = paymentIntent.charges?.data?.[0]?.payment_method_details?.pix || null;
      let amount = (paymentIntent.amount / 100).toLocaleString('pt-BR', { style: 'currency', currency: paymentIntent.currency.toUpperCase() });
      let orderId = paymentIntent.id;
      let orderDate = new Date(paymentIntent.created * 1000).toLocaleString('pt-BR');
      let paymentDetails = '';
      if (paymentMethod === 'card') {
        paymentDetails = `Cartão de crédito final ${cardLast4}`;
      } else if (paymentMethod === 'boleto') {
        paymentDetails = `Boleto bancário <a href="${boletoUrl}">Ver boleto</a>`;
      } else if (paymentMethod === 'pix') {
        paymentDetails = `Pix`;
      } else {
        paymentDetails = paymentMethod;
      }
      if (!customerEmail && paymentIntent.customer) {
        try {
          const customer = await stripe.customers.retrieve(paymentIntent.customer);
          customerEmail = customer.email;
          customerName = customer.name || customerName;
          console.log('Fetched customer email from Stripe customer object:', customerEmail);
        } catch (err) {
          console.error('Error fetching customer from Stripe:', err);
        }
      }
      if (customerEmail) {
        try {
          await resend.emails.send({
            from: process.env.EMAIL_FROM || 'no-reply@resend.dev',
            to: customerEmail,
            subject: 'Pagamento aprovado!',
            html: `
              <p>Olá${customerName ? ', ' + customerName : ''}!</p>
              <p>Seu pagamento foi aprovado!</p>
              <ul>
                <li><b>Valor:</b> ${amount}</li>
                <li><b>Método de pagamento:</b> ${paymentDetails}</li>
                <li><b>Número do pedido:</b> ${orderId}</li>
                <li><b>Data:</b> ${orderDate}</li>
              </ul>
              <p>Em breve você receberá acesso ao seu produto.</p>
            `,
          });
          console.log('Payment confirmation email sent to:', customerEmail);
        } catch (err) {
          console.error('Error sending payment confirmation email:', err);
        }
      } else {
        console.log('Customer email not found in payment_intent.succeeded event.');
      }
      break;
    }
    case 'payment_intent.processing':
      // Payment is processing (boleto aguardando compensação)
      console.log('ℹ️ Payment processing:', stripeEvent.data.object.id);
      break;
    case 'payment_intent.payment_failed': {
      // Payment failed: notify the customer
      const paymentIntent = stripeEvent.data.object;
      let customerEmail = paymentIntent.receipt_email || paymentIntent.charges?.data?.[0]?.billing_details?.email || paymentIntent.customer_email;
      let customerName = paymentIntent.charges?.data?.[0]?.billing_details?.name || '';
      let paymentMethod = paymentIntent.charges?.data?.[0]?.payment_method_details?.type || '';
      let cardLast4 = paymentIntent.charges?.data?.[0]?.payment_method_details?.card?.last4 || '';
      let boletoUrl = paymentIntent.charges?.data?.[0]?.payment_method_details?.boleto?.url || '';
      let pixInfo = paymentIntent.charges?.data?.[0]?.payment_method_details?.pix || null;
      let amount = (paymentIntent.amount / 100).toLocaleString('pt-BR', { style: 'currency', currency: paymentIntent.currency.toUpperCase() });
      let orderId = paymentIntent.id;
      let orderDate = new Date(paymentIntent.created * 1000).toLocaleString('pt-BR');
      let paymentDetails = '';
      if (paymentMethod === 'card') {
        paymentDetails = `Cartão de crédito final ${cardLast4}`;
      } else if (paymentMethod === 'boleto') {
        paymentDetails = `Boleto bancário <a href="${boletoUrl}">Ver boleto</a>`;
      } else if (paymentMethod === 'pix') {
        paymentDetails = `Pix`;
      } else {
        paymentDetails = paymentMethod;
      }
      // Error details
      const errorMsg = paymentIntent.last_payment_error?.message || '';
      const errorCode = paymentIntent.last_payment_error?.code || '';
      const declineCode = paymentIntent.last_payment_error?.decline_code || '';
      const cancellationReason = paymentIntent.cancellation_reason || '';
      if (!customerEmail && paymentIntent.customer) {
        try {
          const customer = await stripe.customers.retrieve(paymentIntent.customer);
          customerEmail = customer.email;
          customerName = customer.name || customerName;
        } catch (err) {
          console.error('Error fetching customer from Stripe:', err);
        }
      }
      if (customerEmail) {
        try {
          await resend.emails.send({
            from: process.env.EMAIL_FROM || 'no-reply@resend.dev',
            to: customerEmail,
            subject: 'Pagamento não aprovado',
            html: `
              <p>Olá${customerName ? ', ' + customerName : ''}!</p>
              <p>Seu pagamento <b>não foi aprovado</b>.</p>
              <ul>
                <li><b>Valor:</b> ${amount}</li>
                <li><b>Método de pagamento:</b> ${paymentDetails}</li>
                <li><b>Número do pedido:</b> ${orderId}</li>
                <li><b>Data:</b> ${orderDate}</li>
              </ul>
              ${errorMsg ? `<p><b>Motivo:</b> ${errorMsg}</p>` : ''}
              ${errorCode ? `<p><b>Código do erro:</b> ${errorCode}</p>` : ''}
              ${declineCode ? `<p><b>Código de recusa:</b> ${declineCode}</p>` : ''}
              ${cancellationReason ? `<p><b>Motivo do cancelamento:</b> ${cancellationReason}</p>` : ''}
              <p>Por favor, tente novamente ou utilize outro método de pagamento.</p>
            `,
          });
          console.log('Payment failed email sent to:', customerEmail);
        } catch (err) {
          console.error('Error sending payment failed email:', err);
        }
      } else {
        console.log('Customer email not found in payment_intent.payment_failed event.');
      }
      break;
    }
    case 'payment_intent.canceled': {
      // Payment canceled: notify the customer
      const paymentIntent = stripeEvent.data.object;
      let customerEmail = paymentIntent.receipt_email || paymentIntent.charges?.data?.[0]?.billing_details?.email || paymentIntent.customer_email;
      let customerName = paymentIntent.charges?.data?.[0]?.billing_details?.name || '';
      let paymentMethod = paymentIntent.charges?.data?.[0]?.payment_method_details?.type || '';
      let cardLast4 = paymentIntent.charges?.data?.[0]?.payment_method_details?.card?.last4 || '';
      let boletoUrl = paymentIntent.charges?.data?.[0]?.payment_method_details?.boleto?.url || '';
      let pixInfo = paymentIntent.charges?.data?.[0]?.payment_method_details?.pix || null;
      let amount = (paymentIntent.amount / 100).toLocaleString('pt-BR', { style: 'currency', currency: paymentIntent.currency.toUpperCase() });
      let orderId = paymentIntent.id;
      let orderDate = new Date(paymentIntent.created * 1000).toLocaleString('pt-BR');
      let paymentDetails = '';
      if (paymentMethod === 'card') {
        paymentDetails = `Cartão de crédito final ${cardLast4}`;
      } else if (paymentMethod === 'boleto') {
        paymentDetails = `Boleto bancário <a href="${boletoUrl}">Ver boleto</a>`;
      } else if (paymentMethod === 'pix') {
        paymentDetails = `Pix`;
      } else {
        paymentDetails = paymentMethod;
      }
      // Cancel reason
      const cancelReason = paymentIntent.cancellation_reason || '';
      if (!customerEmail && paymentIntent.customer) {
        try {
          const customer = await stripe.customers.retrieve(paymentIntent.customer);
          customerEmail = customer.email;
          customerName = customer.name || customerName;
        } catch (err) {
          console.error('Error fetching customer from Stripe:', err);
        }
      }
      if (customerEmail) {
        try {
          await resend.emails.send({
            from: process.env.EMAIL_FROM || 'no-reply@resend.dev',
            to: customerEmail,
            subject: 'Pedido cancelado',
            html: `
              <p>Olá${customerName ? ', ' + customerName : ''}!</p>
              <p>Seu pedido foi <b>cancelado</b>.</p>
              <ul>
                <li><b>Valor:</b> ${amount}</li>
                <li><b>Método de pagamento:</b> ${paymentDetails}</li>
                <li><b>Número do pedido:</b> ${orderId}</li>
                <li><b>Data:</b> ${orderDate}</li>
              </ul>
              ${cancelReason ? `<p><b>Motivo do cancelamento:</b> ${cancelReason}</p>` : ''}
              <p>Se isso foi um engano, por favor, realize a compra novamente.</p>
            `,
          });
          console.log('Payment canceled email sent to:', customerEmail);
        } catch (err) {
          console.error('Error sending payment canceled email:', err);
        }
      } else {
        console.log('Customer email not found in payment_intent.canceled event.');
      }
      break;
    }
    case 'checkout.session.completed': {
      // Order received: send confirmation email to the customer
      const session = stripeEvent.data.object;
      const customerEmail = session.customer_details?.email || session.customer_email;
      const customerName = session.customer_details?.name || '';
      const orderId = session.id;
      const orderDate = new Date(session.created * 1000).toLocaleString('pt-BR');
      let itemsHtml = '';
      let total = (session.amount_total / 100).toLocaleString('pt-BR', { style: 'currency', currency: session.currency.toUpperCase() });
      try {
        // Fetch line items for the session
        const lineItems = await stripe.checkout.sessions.listLineItems(session.id, { limit: 10 });
        itemsHtml = lineItems.data.map(item => `
          <li><b>${item.description}</b> — Qtd: ${item.quantity} — Valor: ${(item.amount_total / 100).toLocaleString('pt-BR', { style: 'currency', currency: session.currency.toUpperCase() })}</li>
        `).join('');
      } catch (err) {
        console.error('Error fetching line items:', err);
      }
      if (customerEmail) {
        try {
          await resend.emails.send({
            from: process.env.EMAIL_FROM || 'no-reply@resend.dev',
            to: customerEmail,
            subject: 'Recebemos o seu pedido!',
            html: `
              <p>Olá${customerName ? ', ' + customerName : ''}!</p>
              <p>Recebemos seu pedido e estamos processando:</p>
              <ul>${itemsHtml}</ul>
              <p><b>Total:</b> ${total}</p>
              <p><b>Número do pedido:</b> ${orderId}</p>
              <p><b>Data:</b> ${orderDate}</p>
              <p>Se precisar de ajuda, entre em contato conosco.</p>
            `,
          });
          console.log('Order confirmation email sent to:', customerEmail);
        } catch (err) {
          console.error('Error sending order confirmation email:', err);
        }
      } else {
        console.log('Customer email not found in checkout.session.completed event.');
      }
      break;
    }
    default:
      // Unhandled event type
      console.log(`Unhandled event type: ${stripeEvent.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  return {
    statusCode: 200,
    body: JSON.stringify({ received: true }),
  };
}; 