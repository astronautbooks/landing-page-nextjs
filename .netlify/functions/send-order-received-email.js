const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
// Remove SendGrid import
// const sgMail = require('@sendgrid/mail');

// Import Resend SDK
const { Resend } = require('resend');

// Initialize Resend with API key from environment variables
const resend = new Resend(process.env.RESEND_API_KEY);

// Idempotency control: store sent session_ids in a temp file (works for serverless/local dev)
const fs = require('fs');
const path = require('path');
const SENT_SESSIONS_FILE = '/tmp/sent_sessions.json';

exports.handler = async function(event) {
  console.log('--- [send-order-received-email] Function called ---');
  console.log('HTTP Method:', event.httpMethod);
  if (event.httpMethod !== 'POST') {
    console.log('Method not allowed:', event.httpMethod);
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  try {
    const { session_id } = JSON.parse(event.body);
    console.log('[Step] Parsed session_id:', session_id);
    if (!session_id) {
      console.log('[Error] Missing session_id in request body');
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing session_id' })
      };
    }

    // Idempotency check: has this session_id already been processed?
    let sentSessions = [];
    if (fs.existsSync(SENT_SESSIONS_FILE)) {
      try {
        const fileContent = fs.readFileSync(SENT_SESSIONS_FILE, 'utf8');
        console.log('[Step] Read sent_sessions file:', fileContent);
        sentSessions = JSON.parse(fileContent);
      } catch (e) {
        console.error('[Error] Reading sent_sessions file:', e);
        sentSessions = [];
      }
    } else {
      console.log('[Step] sent_sessions file does not exist yet.');
    }
    if (sentSessions.includes(session_id)) {
      console.log('[Idempotency] Email already sent for this session_id:', session_id);
      return {
        statusCode: 200,
        body: JSON.stringify({ success: true, alreadySent: true })
      };
    }

    // Retrieve Stripe session
    console.log('[Step] Retrieving Stripe session for session_id:', session_id);
    const session = await stripe.checkout.sessions.retrieve(session_id);
    const customerEmail = session.customer_details?.email || session.customer_email;
    console.log('[Step] Email found in Stripe session:', customerEmail);
    if (!customerEmail) {
      console.log('[Error] Email not found in Stripe session');
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Email not found in session' })
      };
    }

    // Build the email object for Resend
    /**
     * Sends an order received email to the customer using Resend API.
     * The 'from' field can be any email, but for best deliverability, verify your domain in Resend dashboard.
     */
    const emailOptions = {
      from: process.env.EMAIL_FROM || 'no-reply@resend.dev', // Use a verified sender if possible
      to: customerEmail,
      subject: 'Order received!',
      html: '<p>Hello! We have received your order and are processing it. You will soon receive payment confirmation.</p>',
    };
    console.log('[Step] Email options for Resend:', emailOptions);

    // Send the email using Resend
    console.log('[Step] Sending email via Resend...');
    const resendResponse = await resend.emails.send(emailOptions);
    console.log('[Step] Resend API response:', resendResponse);

    // Register this session_id as sent
    sentSessions.push(session_id);
    try {
      fs.writeFileSync(SENT_SESSIONS_FILE, JSON.stringify(sentSessions));
      console.log('[Step] Updated sent_sessions file:', sentSessions);
    } catch (e) {
      console.error('[Error] Writing sent_sessions file:', e);
    }

    console.log('--- [send-order-received-email] Function completed successfully ---');
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true })
    };
  } catch (error) {
    console.error('[Error] Exception in send-order-received-email:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
}; 