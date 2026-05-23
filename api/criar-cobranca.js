module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  /* ---------- Rate Limiting (memoria volatil, suficiente para evento unico) ---------- */
  const RATE_LIMIT = global._rateLimitMap || new Map();
  global._rateLimitMap = RATE_LIMIT;

  const ip = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown';
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minuto
  const maxReq = 5;

  const entries = RATE_LIMIT.get(ip) || [];
  const recent = entries.filter(t => t > now - windowMs);

  if (recent.length >= maxReq) {
    res.status(429).json({ error: 'Muitas requisicoes. Aguarde um momento.' });
    return;
  }
  recent.push(now);
  RATE_LIMIT.set(ip, recent);

  /* ---------- Validacao de entrada ---------- */
  const { presente, valor, nome, sobrenome } = req.body || {};

  if (!presente || typeof presente !== 'string' || presente.length < 2 || presente.length > 200) {
    res.status(400).json({ error: 'Presente invalido' });
    return;
  }
  if (!nome || typeof nome !== 'string' || nome.length < 2 || nome.length > 50) {
    res.status(400).json({ error: 'Nome invalido' });
    return;
  }
  if (!sobrenome || typeof sobrenome !== 'string' || sobrenome.length < 2 || sobrenome.length > 50) {
    res.status(400).json({ error: 'Sobrenome invalido' });
    return;
  }
  const valorNum = Number(valor);
  if (!Number.isFinite(valorNum) || valorNum <= 0 || valorNum > 10000) {
    res.status(400).json({ error: 'Valor invalido' });
    return;
  }

  const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;
  if (!accessToken) {
    res.status(500).json({ error: 'MERCADO_PAGO_ACCESS_TOKEN nao configurado' });
    return;
  }

  const sanitize = str => str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]/g, '');

  const safeNome = sanitize(nome);
  const safeSobrenome = sanitize(sobrenome);

  if (!safeNome || !safeSobrenome) {
    res.status(400).json({ error: 'Nome/sobrenome contem caracteres invalidos' });
    return;
  }

  const payerEmail = `${safeNome}.${safeSobrenome}@email.com`;

  try {
    const response = await fetch('https://api.mercadopago.com/v1/payments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'X-Idempotency-Key': `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`
      },
      body: JSON.stringify({
        transaction_amount: valorNum,
        description: `Presente: ${presente} - ${nome.trim()} ${sobrenome.trim()}`,
        payment_method_id: 'pix',
        payer: {
          email: payerEmail,
          first_name: nome.trim(),
          last_name: sobrenome.trim()
        },
        notification_url: `${process.env.BASE_URL || req.headers.origin || ''}/api/pix-confirmado?secret=${encodeURIComponent(process.env.WEBHOOK_SECRET || '')}`
      })
    });

    const data = await response.json();
    if (!response.ok) {
      res.status(response.status).json({ error: data.message || 'Erro ao criar cobranca PIX' });
      return;
    }

    const qrCodeImage = data.point_of_interaction?.transaction_data?.qr_code_base64
      ? `data:image/png;base64,${data.point_of_interaction.transaction_data.qr_code_base64}`
      : '';
    const brCode = data.point_of_interaction?.transaction_data?.qr_code || '';

    res.status(200).json({
      qrCodeImage,
      brCode,
      correlationID: String(data.id)
    });
  } catch (e) {
    res.status(500).json({ error: e.message || 'Erro interno' });
  }
};
