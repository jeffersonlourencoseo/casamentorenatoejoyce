const crypto = require('crypto');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const secret = process.env.OPENPIX_WEBHOOK_SECRET;
  if (secret) {
    const hmacHeader = req.headers['x-webhook-hmac'] || '';
    const bodyString = JSON.stringify(req.body);
    const expected = crypto.createHmac('sha256', secret).update(bodyString).digest('hex');
    // Time-safe compare is not critical here but nice
    if (hmacHeader !== expected) {
      res.status(401).json({ error: 'Assinatura inválida' });
      return;
    }
  }

  const { correlationID, status } = req.body || {};
  if (!correlationID || status !== 'COMPLETED') {
    res.status(200).json({ ok: true });
    return;
  }

  const googleUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  if (googleUrl) {
    try {
      await fetch(googleUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'markPurchased',
          correlationID,
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

  if (emailjsService && emailjsTemplate && emailjsPublicKey) {
    try {
      await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_id: emailjsService,
          template_id: emailjsTemplate,
          user_id: emailjsPublicKey,
          template_params: {
            correlation_id: correlationID,
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
