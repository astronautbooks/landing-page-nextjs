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
      /**
       * Send payment confirmation email to the customer using Resend
       * Tries to get the customer email from the payment intent object
       */
      const paymentIntent = stripeEvent.data.object;
      // Try to get the email from different possible locations
      let customerEmail = paymentIntent.receipt_email || paymentIntent.charges?.data?.[0]?.billing_details?.email || paymentIntent.customer_email;
      if (!customerEmail && paymentIntent.customer) {
        // If not found, fetch the customer object from Stripe
        try {
          const customer = await stripe.customers.retrieve(paymentIntent.customer);
          customerEmail = customer.email;
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
            html: '<p>Seu pagamento foi aprovado! Em breve você receberá acesso ao seu produto.</p>',
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
    case 'payment_intent.payment_failed':
      // Payment failed
      console.log('❌ Payment failed:', stripeEvent.data.object.id);
      break;
    case 'payment_intent.canceled':
      // Payment was canceled
      console.log('⚠️ Payment canceled:', stripeEvent.data.object.id);
      break;
    case 'checkout.session.completed': {
      // Order received: send confirmation email to the customer
      const session = stripeEvent.data.object;
      const customerEmail = session.customer_details?.email || session.customer_email;
      if (customerEmail) {
        try {
          await resend.emails.send({
            from: process.env.EMAIL_FROM || 'no-reply@resend.dev',
            to: customerEmail,
            subject: 'Recebemos o seu pedido!',
            html: '<p>Olá! Recebemos o seu pedido e estamos processando. Em breve você receberá a confirmação do pagamento.</p>',
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