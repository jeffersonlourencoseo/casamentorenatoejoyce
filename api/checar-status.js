module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { id } = req.query || {};
  if (!id) {
    res.status(400).json({ error: 'paymentId ausente' });
    return;
  }

  const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;
  if (!accessToken) {
    res.status(500).json({ error: 'MERCADO_PAGO_ACCESS_TOKEN não configurado' });
    return;
  }

  try {
    const response = await fetch(`https://api.mercadopago.com/v1/payments/${encodeURIComponent(id)}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    const data = await response.json();
    if (!response.ok) {
      res.status(response.status).json({ error: data.message || 'Erro ao consultar pagamento' });
      return;
    }

    const mpStatus = data.status || 'pending';
    let status = 'PENDING';
    if (mpStatus === 'approved') status = 'COMPLETED';
    else if (mpStatus === 'cancelled' || mpStatus === 'rejected') status = 'EXPIRED';

    res.status(200).json({ status });
  } catch (e) {
    res.status(500).json({ error: e.message || 'Erro interno' });
  }
};
