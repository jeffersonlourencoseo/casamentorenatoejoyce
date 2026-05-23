module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const aba = req.query.aba;
  if (!aba) {
    res.status(400).json({ error: 'Parametro aba obrigatorio' });
    return;
  }

  const googleUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  const scriptToken = process.env.SCRIPT_TOKEN;

  if (!googleUrl || !scriptToken) {
    res.status(500).json({ error: 'Configuracao incompleta no servidor' });
    return;
  }

  try {
    const url = new URL(googleUrl);
    url.searchParams.set('aba', aba);
    url.searchParams.set('token', scriptToken);

    const response = await fetch(url.toString(), { method: 'GET' });
    const data = await response.json();

    if (!response.ok || data.error) {
      res.status(response.status || 500).json({ error: data.error || 'Erro ao consultar dados' });
      return;
    }

    res.status(200).json(data);
  } catch (e) {
    res.status(500).json({ error: e.message || 'Erro interno' });
  }
};
