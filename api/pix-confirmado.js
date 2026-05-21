module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;

  // Mercado Pago webhook body
  const { type, data } = req.body || {};

  // Extract payment ID
  let paymentId = null;
  if (data && data.id) paymentId = String(data.id);

  if (!paymentId) {
    res.status(200).json({ ok: true });
    return;
  }

  // Verify payment is approved via API
  let isApproved = false;
  if (accessToken) {
    try {
      const response = await fetch(`https://api.mercadopago.com/v1/payments/${encodeURIComponent(paymentId)}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      const paymentData = await response.json();
      if (response.ok && paymentData.status === 'approved') {
        isApproved = true;
      }
    } catch (e) {
      // Silently fail
    }
  }

  if (!isApproved) {
    res.status(200).json({ ok: true });
    return;
  }

  // Extract gift info from Mercado Pago payment data
  const description = paymentData.description || '';
  const presenteMatch = description.match(/Presente: (.*?) -/);
  const presente = presenteMatch ? presenteMatch[1].trim() : '';
  const payerFirstName = paymentData.payer?.first_name || '';
  const payerLastName = paymentData.payer?.last_name || '';
  const transactionAmount = paymentData.transaction_amount || '';

  // Mark in Google Sheets
  const googleUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  if (googleUrl && presente) {
    try {
      await fetch(googleUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({
          presente,
          nome: payerFirstName,
          sobrenome: payerLastName,
          valor: transactionAmount,
          recado: '',
          status: 'COMPLETED',
          correlationID: paymentId,
          timestamp: new Date().toISOString()
        })
      });
    } catch (e) {
      // Log but don't fail webhook
    }
  }

  // EmailJS notification
  const emailjsService = process.env.EMAILJS_SERVICE_ID;
  const emailjsTemplate = process.env.EMAILJS_TEMPLATE_PRESENTE;
  const emailjsPublicKey = process.env.EMAILJS_PUBLIC_KEY;

  if (emailjsService && emailjsTemplate && emailjsPublicKey && presente) {
    try {
      await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_id: emailjsService,
          template_id: emailjsTemplate,
          user_id: emailjsPublicKey,
          template_params: {
            to_name: 'Renato & Joyce',
            from_name: `${payerFirstName} ${payerLastName}`,
            subject: `🎁 ${payerFirstName} comprou um presente!`,
            message: `${presente} (R$ ${transactionAmount}) — Pagamento confirmado via webhook.`,
            timestamp: new Date().toLocaleString('pt-BR')
          }
        })
      });
    } catch (e) {
      // Log but don't fail webhook
    }
  }

  res.status(200).json({ ok: true });
};
