module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { id } = req.query || {};
  if (!id) {
    res.status(400).json({ error: 'correlationID ausente' });
    return;
  }

  const appId = process.env.OPENPIX_APP_ID;
  if (!appId) {
    res.status(500).json({ error: 'OPENPIX_APP_ID não configurado' });
    return;
  }

  try {
    const response = await fetch(`https://api.openpix.com.br/api/v2/charge/${encodeURIComponent(id)}`, {
      method: 'GET',
      headers: {
        'Authorization': appId
      }
    });

    const data = await response.json();
    if (!response.ok) {
      res.status(response.status).json({ error: data.message || 'Erro OpenPix' });
      return;
    }

    const charge = data.charge || data;
    res.status(200).json({ status: charge.status || 'ACTIVE' });
  } catch (e) {
    res.status(500).json({ error: e.message || 'Erro interno' });
  }
};
