const { randomUUID } = require('crypto');

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

  const appId = process.env.OPENPIX_APP_ID;
  if (!appId) {
    res.status(500).json({ error: 'OPENPIX_APP_ID não configurado' });
    return;
  }

  const correlationID = randomUUID();
  const valueInCents = Math.round(valor * 100);
  const comment = `Presente: ${presente} - ${nome} ${sobrenome}`;

  try {
    const response = await fetch('https://api.openpix.com.br/api/v2/charge', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': appId
      },
      body: JSON.stringify({
        correlationID,
        value: valueInCents,
        comment
      })
    });

    const data = await response.json();
    if (!response.ok) {
      res.status(response.status).json({ error: data.message || 'Erro OpenPix' });
      return;
    }

    const charge = data.charge || data;
    res.status(200).json({
      qrCodeImage: charge.qrCodeImage || charge.qrCode || '',
      brCode: charge.brCode || charge.pixKey || '',
      correlationID
    });
  } catch (e) {
    res.status(500).json({ error: e.message || 'Erro interno' });
  }
};
