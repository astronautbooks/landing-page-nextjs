// Serverless function to handle Stripe webhooks (for boleto and other payment events)
// Place your STRIPE_WEBHOOK_SECRET in your environment variables

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
// Import Resend SDK
const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// Função utilitária para gerar um número de pedido aleatório e único
async function generateOrderNumber(supabase) {
  let unique = false;
  let orderNumber;
  while (!unique) {
    orderNumber = Math.floor(100000 + Math.random() * 900000); // 6 dígitos
    const { data } = await supabase
      .from('orders')
      .select('id')
      .eq('order_number', orderNumber)
      .single();
    if (!data) unique = true;
  }
  return orderNumber;
}

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
  console.log('DEBUG webhook event type:', stripeEvent.type);
  switch (stripeEvent.type) {
    case 'payment_intent.succeeded': {
      // Delay de 5 segundos para garantir que o registro já foi criado
      await new Promise(resolve => setTimeout(resolve, 8000));
      const paymentIntent = stripeEvent.data.object;
      const paymentIntentId = paymentIntent.id;

      // Buscar o app_id correspondente ao payment_intent
      let appId = paymentIntentId;
      const { data: paymentRow } = await supabase
        .from('payments')
        .select('app_id')
        .eq('stripe_id', paymentIntentId)
        .single();
      if (paymentRow && paymentRow.app_id) {
        appId = paymentRow.app_id;
      }

      let customerEmail = paymentIntent.receipt_email || paymentIntent.charges?.data?.[0]?.billing_details?.email || paymentIntent.customer_email;
      let customerName = paymentIntent.charges?.data?.[0]?.billing_details?.name || '';
      let paymentMethod = paymentIntent.charges?.data?.[0]?.payment_method_details?.type || '';
      let cardLast4 = paymentIntent.charges?.data?.[0]?.payment_method_details?.card?.last4 || '';
      let boletoUrl = paymentIntent.charges?.data?.[0]?.payment_method_details?.boleto?.url || '';
      let pixInfo = paymentIntent.charges?.data?.[0]?.payment_method_details?.pix || null;
      let amount = (paymentIntent.amount / 100).toLocaleString('pt-BR', { style: 'currency', currency: paymentIntent.currency.toUpperCase() });
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
        } catch (err) {}
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
                <li><b>Número do pedido:</b> ${appId}</li>
                <li><b>Data:</b> ${orderDate}</li>
              </ul>
              <p>Em breve você receberá acesso ao seu produto.</p>
            `,
          });
        } catch (err) {}
      }
      break;
    }
    case 'payment_intent.processing':
      // Payment is processing (boleto aguardando compensação)
      console.log('ℹ️ Payment processing:', stripeEvent.data.object.id);
      break;
    case 'payment_intent.payment_failed': {
      // Atualizar pedido para 'failed'
      const paymentIntent = stripeEvent.data.object;
      const paymentIntentId = paymentIntent.id;
      await supabase
        .from('orders')
        .update({ status: 'failed' })
        .eq('payment_intent_id', paymentIntentId);
      // Payment failed: notify the customer
      const customerEmail = paymentIntent.receipt_email || paymentIntent.charges?.data?.[0]?.billing_details?.email || paymentIntent.customer_email;
      const customerName = paymentIntent.charges?.data?.[0]?.billing_details?.name || '';
      const paymentMethod = paymentIntent.charges?.data?.[0]?.payment_method_details?.type || '';
      const cardLast4 = paymentIntent.charges?.data?.[0]?.payment_method_details?.card?.last4 || '';
      const boletoUrl = paymentIntent.charges?.data?.[0]?.payment_method_details?.boleto?.url || '';
      const pixInfo = paymentIntent.charges?.data?.[0]?.payment_method_details?.pix || null;
      const amount = (paymentIntent.amount / 100).toLocaleString('pt-BR', { style: 'currency', currency: paymentIntent.currency.toUpperCase() });
      const orderId = paymentIntent.id;
      const orderDate = new Date(paymentIntent.created * 1000).toLocaleString('pt-BR');
      const paymentDetails = '';
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
      // Atualizar pedido para 'canceled'
      const paymentIntent = stripeEvent.data.object;
      const paymentIntentId = paymentIntent.id;
      await supabase
        .from('orders')
        .update({ status: 'canceled' })
        .eq('payment_intent_id', paymentIntentId);
      // Payment canceled: notify the customer
      const customerEmail = paymentIntent.receipt_email || paymentIntent.charges?.data?.[0]?.billing_details?.email || paymentIntent.customer_email;
      const customerName = paymentIntent.charges?.data?.[0]?.billing_details?.name || '';
      const paymentMethod = paymentIntent.charges?.data?.[0]?.payment_method_details?.type || '';
      const cardLast4 = paymentIntent.charges?.data?.[0]?.payment_method_details?.card?.last4 || '';
      const boletoUrl = paymentIntent.charges?.data?.[0]?.payment_method_details?.boleto?.url || '';
      const pixInfo = paymentIntent.charges?.data?.[0]?.payment_method_details?.pix || null;
      const amount = (paymentIntent.amount / 100).toLocaleString('pt-BR', { style: 'currency', currency: paymentIntent.currency.toUpperCase() });
      const orderId = paymentIntent.id;
      const orderDate = new Date(paymentIntent.created * 1000).toLocaleString('pt-BR');
      const paymentDetails = '';
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
      // Gera um número amigável único para o app_id
      let unique = false;
      let appId;
      while (!unique) {
        appId = Math.floor(100000 + Math.random() * 900000).toString(); // 6 dígitos
        const { data } = await supabase
          .from('payments')
          .select('id')
          .eq('app_id', appId)
          .single();
        if (!data) unique = true;
      }
      // Grava na tabela payments: app_id e stripe_id (payment_intent)
      await supabase
        .from('payments')
        .insert([
          {
            app_id: appId,
            stripe_id: stripeEvent.data.object.payment_intent,
          }
        ]);

      // Envio de e-mail de confirmação (mantido)
      const session = stripeEvent.data.object;
      const customerEmail = session.customer_details?.email || session.customer_email;
      const customerName = session.customer_details?.name || '';
      const orderDate = new Date(session.created * 1000).toLocaleString('pt-BR');
      let total = (session.amount_total / 100).toLocaleString('pt-BR', { style: 'currency', currency: session.currency.toUpperCase() });
      if (customerEmail) {
        try {
          await resend.emails.send({
            from: process.env.EMAIL_FROM || 'no-reply@resend.dev',
            to: customerEmail,
            subject: 'Recebemos o seu pedido!',
            html: `
              <p>Olá${customerName ? ', ' + customerName : ''}!</p>
              <p>Recebemos seu pedido e estamos processando.</p>
              <p><b>Total:</b> ${total}</p>
              <p><b>Número do pedido:</b> ${appId}</p>
              <p><b>Data:</b> ${orderDate}</p>
              <p>Se precisar de ajuda, entre em contato conosco.</p>
            `,
          });
        } catch (err) {
          // Silencie erros de e-mail
        }
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