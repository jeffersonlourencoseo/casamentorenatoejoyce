module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { presente, valor, nome, sobrenome } = req.body || {};
  if (!presente || !valor || !nome || !sobrenome) {
    res.status(400).json({ error: 'Dados incompletos' });
    return;
  }

  const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;
  if (!accessToken) {
    res.status(500).json({ error: 'MERCADO_PAGO_ACCESS_TOKEN não configurado' });
    return;
  }

  const payerEmail = `${nome.toLowerCase().replace(/\s/g, '')}.${sobrenome.toLowerCase().replace(/\s/g, '')}@convidado.casamento`;

  try {
    const response = await fetch('https://api.mercadopago.com/v1/payments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'X-Idempotency-Key': `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`
      },
      body: JSON.stringify({
        transaction_amount: valor,
        description: `Presente: ${presente} - ${nome} ${sobrenome}`,
        payment_method_id: 'pix',
        payer: {
          email: payerEmail,
          first_name: nome,
          last_name: sobrenome
        },
        notification_url: `${req.headers.origin || ''}/api/pix-confirmado`
      })
    });

    const data = await response.json();
    if (!response.ok) {
      res.status(response.status).json({ error: data.message || 'Erro ao criar cobrança PIX' });
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
