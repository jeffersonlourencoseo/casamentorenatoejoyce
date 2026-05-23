module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  /* ---------- Validacao de origem (query secret) ---------- */
  const expectedSecret = process.env.WEBHOOK_SECRET;
  const receivedSecret = req.query?.secret || '';

  if (!expectedSecret || receivedSecret !== expectedSecret) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;
  const { data } = req.body || {};
  let paymentId = null;
  if (data && data.id) paymentId = String(data.id);

  if (!paymentId) {
    res.status(200).json({ ok: true });
    return;
  }

  // Verificar pagamento na API do Mercado Pago
  let isApproved = false;
  let paymentData = {};

  if (accessToken) {
    try {
      const response = await fetch(`https://api.mercadopago.com/v1/payments/${encodeURIComponent(paymentId)}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      paymentData = await response.json();
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

  // Extrair dados do presente
  const description = paymentData.description || '';
  const presenteMatch = description.match(/Presente: (.*?) -/);
  const presente = presenteMatch ? presenteMatch[1].trim() : '';
  const payerFirstName = paymentData.payer?.first_name || '';
  const payerLastName = paymentData.payer?.last_name || '';
  const transactionAmount = paymentData.transaction_amount || '';

  // Salvar no Google Sheets via proxy seguro (com token)
  const googleUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  const scriptToken = process.env.SCRIPT_TOKEN;

  if (googleUrl && presente) {
    try {
      await fetch(googleUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({
          token: scriptToken,
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
      console.error('Erro ao salvar no Sheets:', e.message);
    }
  }

  // Notificacao EmailJS
  const emailjsService = process.env.EMAILJS_SERVICE_ID;
  const emailjsTemplate = process.env.EMAILJS_TEMPLATE_PRESENTE;
  const emailjsPublicKey = process.env.EMAILJS_PUBLIC_KEY;

  if (emailjsService && emailjsTemplate && emailjsPublicKey && presente) {
    try {
      const emailBody = {
        service_id: emailjsService,
        template_id: emailjsTemplate,
        user_id: emailjsPublicKey,
        template_params: {
          to_name: 'Renato & Joyce',
          from_name: `${payerFirstName} ${payerLastName}`,
          subject: `🎁 ${payerFirstName} comprou um presente!`,
          message: `Presente: ${presente} (R$ ${transactionAmount})\nRecado: Nenhum (confirmado via webhook)`,
          timestamp: new Date().toLocaleString('pt-BR')
        }
      };
      const emailRes = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(emailBody)
      });
      if (!emailRes.ok) {
        const errText = await emailRes.text();
        console.error('Webhook EmailJS erro:', emailRes.status, errText);
      }
    } catch (e) {
      console.error('Webhook EmailJS exception:', e);
    }
  }

  res.status(200).json({ ok: true });
};
