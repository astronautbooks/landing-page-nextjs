// Serverless function to handle Stripe webhooks (for boleto and other payment events)
// Place your STRIPE_WEBHOOK_SECRET in your environment variables

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
// Import Resend SDK
const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const path = require('path');
const fs = require('fs');
const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');

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

// Função utilitária para gerar PDF com watermark personalizada
async function gerarPdfComWatermark(pdfBytes, watermarkText) {
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const pages = pdfDoc.getPages();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  pages.forEach(page => {
    const { width, height } = page.getSize();
    page.drawText(watermarkText, {
      x: 40,
      y: height - 30, // Posiciona a marca d'água no topo da página
      size: 10,
      font,
      color: rgb(0.5, 0.5, 0.5),
      opacity: 0.8,
    });
  });
  return await pdfDoc.save();
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
      console.log('*** PAYMENT_INTENT SUCCEEDED ***');

      // Delay para garantir que o registro em 'payments' foi criado pelo evento 'checkout.session.completed'
      await new Promise(resolve => setTimeout(resolve, 8000));
      const paymentIntent = stripeEvent.data.object;
      const paymentIntentId = paymentIntent.id;

      // Buscar o app_id amigável correspondente ao payment_intent
      let appId = paymentIntentId; // Fallback para o ID do Stripe
      const { data: paymentRow } = await supabase
        .from('payments')
        .select('app_id')
        .eq('stripe_id', paymentIntentId)
        .single();
      if (paymentRow && paymentRow.app_id) {
        appId = paymentRow.app_id;
      } else {
        console.warn(`Não foi encontrado um app_id amigável para o payment_intent: ${paymentIntentId}`);
      }

      let customerEmail = paymentIntent.receipt_email || paymentIntent.charges?.data?.[0]?.billing_details?.email || paymentIntent.customer_email;
      let customerName = paymentIntent.charges?.data?.[0]?.billing_details?.name || '';
      if ((!customerEmail || !customerName) && paymentIntent.customer) {
        try {
          const customer = await stripe.customers.retrieve(paymentIntent.customer);
          customerEmail = customerEmail || customer.email;
          customerName = customerName || customer.name;
        } catch (err) {}
      }
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

      // Aguarda 3 segundos antes de enviar o e-mail de entrega
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Buscar a sessão de checkout associada ao payment_intent
      let session;
      try {
        const sessions = await stripe.checkout.sessions.list({ payment_intent: paymentIntentId, limit: 1 });
        session = sessions.data[0];
        // LOGS para depuração do CPF/CNPJ
        console.log('SESSION:', JSON.stringify(session, null, 2));
        console.log('PAYMENT INTENT:', JSON.stringify(paymentIntent, null, 2));
      } catch (err) {
        console.error('Erro ao buscar sessão de checkout pelo payment_intent:', err);
        break;
      }
      if (!session) {
        console.error('Nenhuma sessão de checkout encontrada para o payment_intent:', paymentIntentId);
        break;
      }

      // Buscar os line_items da sessão
      let lineItems;
      try {
        const itemsRes = await stripe.checkout.sessions.listLineItems(session.id, { limit: 100 });
        lineItems = itemsRes.data;
      } catch (err) {
        console.error('Erro ao buscar line_items da sessão:', err);
        break;
      }

      // Buscar todos os livros do Stripe (para mapear priceId -> dados do livro)
      let books = [];
      try {
        const productsRes = await stripe.products.list({ active: true, limit: 100 });
        const products = productsRes.data;
        books = await Promise.all(products.map(async (product) => {
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
            metadata: product.metadata,
          };
        }));
      } catch (err) {
        console.error('Erro ao buscar livros do Stripe:', err);
        break;
      }

      // Montar lista de produtos comprados
      const purchasedBooks = lineItems.map(item => {
        const book = books.find(b => b.priceId === item.price.id);
        if (!book) return null;
        const slug = book.metadata?.slug || book.name.toLowerCase().replace(/ /g, '-');
        const thumb = `/images/${slug}/cover-thumb.png`;
        return {
          name: book.name,
          description: book.description,
          thumb,
          metadata: book.metadata,
        };
      }).filter(Boolean);

      // NOVO FLUXO: Gerar PDFs com marca d'água, fazer upload e obter links seguros
      const deliveryItems = await Promise.all(purchasedBooks.map(async book => {
        try {
          const originalPdfUrl = book.metadata?.url;
          if (!originalPdfUrl) {
            throw new Error(`URL do PDF original não encontrada para o livro: ${book.name}`);
          }

          // 1. Baixar o PDF original
          const axios = require('axios');
          const response = await axios.get(originalPdfUrl, { responseType: 'arraybuffer' });
          const originalPdfBytes = response.data;

          // 2. Aplicar a marca d'água
          const watermarkText = `Comprador: ${customerName || ''} | E-mail: ${customerEmail || ''} | Pedido: ${appId}`;
          const watermarkedPdfBytes = await gerarPdfComWatermark(originalPdfBytes, watermarkText);

          // 3. Fazer upload do PDF modificado
          const newPdfPath = `watermarked-pdfs/${appId}-${book.name.replace(/\s+/g, '_')}.pdf`;
          const { error: uploadError } = await supabase.storage
            .from('astronautbooks-pdfs') // Assumindo que o bucket é 'astronautbooks-pdfs'
            .upload(newPdfPath, watermarkedPdfBytes, {
              contentType: 'application/pdf',
              upsert: true,
            });

          if (uploadError) {
            throw new Error(`Falha no upload do PDF com marca d'água: ${uploadError.message}`);
          }

          // 4. Gerar um link de download seguro
          const { data: signedUrlData, error: signedUrlError } = await supabase.storage
            .from('astronautbooks-pdfs')
            .createSignedUrl(newPdfPath, 60 * 60 * 24 * 7); // Link válido por 7 dias

          if (signedUrlError) {
            throw new Error(`Falha ao criar URL assinada: ${signedUrlError.message}`);
          }
          
          console.log(`PDF com marca d'água gerado e link criado para: ${book.name}`);
          return {
            ...book,
            downloadUrl: signedUrlData.signedUrl,
          };

        } catch (err) {
          console.error(`Falha no processamento do livro "${book.name}":`, err.message);
          return null; // Retorna nulo para filtrar depois
        }
      })).then(items => items.filter(Boolean));

      if (deliveryItems.length === 0) {
        console.error("Nenhum item de entrega foi gerado com sucesso. Abortando envio de e-mail.");
        break;
      }

      // Montar HTML com os links de download seguros
      const productsHtml = `
        <div style="background:#f6f6ff;padding:18px 20px;border-radius:8px;margin:24px 0 28px 0;">
          <p style="margin:0 0 10px 0;">Obrigado por sua compra! Clique nos links abaixo para baixar seu(s) e-book(s) em PDF. Os links são seguros e válidos por tempo limitado.</p>
          <div>
            ${deliveryItems.map(book => `
              <div style="margin-bottom:18px;padding-bottom:12px;border-bottom:1px solid #ececec;">
                <div style="font-size:17px;font-weight:600;color:#3730a3;">${book.name}</div>
                <div style="font-size:14px;color:#666;">${book.description}</div>
                <a href="${book.downloadUrl}" style="display:inline-block;margin-top:10px;padding:10px 15px;background-color:#4f46e5;color:#ffffff;text-decoration:none;border-radius:5px;">Baixar ${book.name}</a>
              </div>
            `).join('')}
          </div>
        </div>
      `;
      
      // Montar corpo do e-mail de entrega
      const deliveryHtml = `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;">
          <h1 style="color:#4f46e5;font-size:28px;margin-bottom:18px;">Seu e-book chegou!</h1>
          <p style="font-size:16px;">Olá, <b>${customerName || ''}</b>!</p>
          <p style="font-size:16px;">Seu pagamento para o pedido <b>#${appId}</b> foi aprovado com sucesso. Agora você já pode acessar seu conteúdo.</p>
          ${productsHtml}
          <p style="font-size:15px;">Se tiver qualquer dúvida ou problema, basta responder este e-mail.<br>Boa leitura e ótimas cores! 🌈</p>
          <div style="color:#aaa;font-size:13px;margin-top:32px;">Equipe Astronaut</div>
        </div>
      `;

      // Enviar o e-mail de entrega com links
      try {
        await resend.emails.send({
          from: process.env.EMAIL_FROM || 'no-reply@resend.dev',
          to: customerEmail,
          subject: `Seu e-book está aqui! (Pedido #${appId})`,
          html: deliveryHtml,
        });
        console.log(`E-mail de entrega com links enviado para: ${customerEmail}`);
      } catch (err) {
        console.error('Falha CRÍTICA ao enviar e-mail de entrega com links:', err);
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
      let customerEmail = paymentIntent.receipt_email || paymentIntent.charges?.data?.[0]?.billing_details?.email || paymentIntent.customer_email;
      let customerName = paymentIntent.charges?.data?.[0]?.billing_details?.name || '';
      if ((!customerEmail || !customerName) && paymentIntent.customer) {
        try {
          const customer = await stripe.customers.retrieve(paymentIntent.customer);
          customerEmail = customerEmail || customer.email;
          customerName = customerName || customer.name;
        } catch (err) {}
      }
      const paymentMethod = paymentIntent.charges?.data?.[0]?.payment_method_details?.type || '';
      const cardLast4 = paymentIntent.charges?.data?.[0]?.payment_method_details?.card?.last4 || '';
      const boletoUrl = paymentIntent.charges?.data?.[0]?.payment_method_details?.boleto?.url || '';
      const pixInfo = paymentIntent.charges?.data?.[0]?.payment_method_details?.pix || null;
      const amount = (paymentIntent.amount / 100).toLocaleString('pt-BR', { style: 'currency', currency: paymentIntent.currency.toUpperCase() });
      const orderId = paymentIntent.id;
      const orderDate = new Date(paymentIntent.created * 1000).toLocaleString('pt-BR');
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
        } catch (err) {}
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
      let customerEmail = paymentIntent.receipt_email || paymentIntent.charges?.data?.[0]?.billing_details?.email || paymentIntent.customer_email;
      let customerName = paymentIntent.charges?.data?.[0]?.billing_details?.name || '';
      if ((!customerEmail || !customerName) && paymentIntent.customer) {
        try {
          const customer = await stripe.customers.retrieve(paymentIntent.customer);
          customerEmail = customerEmail || customer.email;
          customerName = customerName || customer.name;
        } catch (err) {}
      }
      const paymentMethod = paymentIntent.charges?.data?.[0]?.payment_method_details?.type || '';
      const cardLast4 = paymentIntent.charges?.data?.[0]?.payment_method_details?.card?.last4 || '';
      const boletoUrl = paymentIntent.charges?.data?.[0]?.payment_method_details?.boleto?.url || '';
      const pixInfo = paymentIntent.charges?.data?.[0]?.payment_method_details?.pix || null;
      const amount = (paymentIntent.amount / 100).toLocaleString('pt-BR', { style: 'currency', currency: paymentIntent.currency.toUpperCase() });
      const orderId = paymentIntent.id;
      const orderDate = new Date(paymentIntent.created * 1000).toLocaleString('pt-BR');
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
        } catch (err) {}
      } else {
        console.log('Customer email not found in payment_intent.canceled event.');
      }
      break;
    }
    case 'checkout.session.completed': {
      console.log('*** CHECKOUT SESSION COMPLETED ***');
      // Gera um número de pedido amigável, salva no DB e envia e-mail de confirmação.
      const session = stripeEvent.data.object;

      // 1. Gerar número de pedido amigável
      let appId;
      try {
        appId = await generateOrderNumber(supabase);
      } catch(err) {
        console.error("Falha ao gerar número de pedido:", err);
        // Fallback ou tratamento de erro
        return { statusCode: 500, body: 'Falha ao gerar número de pedido.' };
      }
      
      // 2. Gravar na tabela 'payments' para ligar o pedido ao payment_intent
      await supabase
        .from('payments')
        .insert([
          {
            app_id: appId,
            stripe_id: session.payment_intent,
          }
        ]);

      // 3. Enviar e-mail de confirmação de pedido recebido
      let customerEmail = session.customer_details?.email || session.customer_email;
      let customerName = session.customer_details?.name || '';
      if ((!customerEmail || !customerName) && session.customer) {
        try {
          const customer = await stripe.customers.retrieve(session.customer);
          customerEmail = customerEmail || customer.email;
          customerName = customerName || customer.name;
        } catch (err) { /* Ignorar erro */ }
      }
      const to = process.env.EMAIL_DEV_OVERRIDE || customerEmail;
      const orderDate = new Date(session.created * 1000).toLocaleString('pt-BR');
      let total = (session.amount_total / 100).toLocaleString('pt-BR', { style: 'currency', currency: session.currency.toUpperCase() });
      
      if (to) {
        try {
          await resend.emails.send({
            from: process.env.EMAIL_FROM || 'no-reply@resend.dev',
            to,
            subject: `Recebemos seu pedido #${appId}`,
            html: `
              <p>Olá${customerName ? ', ' + customerName : ''}!</p>
              <p>Recebemos seu pedido <b>#${appId}</b> e estamos aguardando a confirmação do pagamento. Assim que for aprovado, você receberá um novo e-mail com acesso ao seu conteúdo.</p>
              <p><b>Total:</b> ${total}</p>
              <p><b>Data:</b> ${orderDate}</p>
              <p>Se precisar de ajuda, entre em contato conosco.</p>
            `,
          });
          console.log(`E-mail de confirmação de pedido #${appId} enviado para: ${to}`);
        } catch (err) {
          console.error(`Falha ao enviar e-mail de confirmação para o pedido #${appId}:`, err);
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